import fs from 'fs/promises';
import path from 'path';

import {resolveItemDestination, resolveTarget} from './config.js';
import {detectConflicts} from './conflict.js';
import {injectDispatcher} from './hooks/manager.js';
import {restoreSkillConfig, stashOriginal} from './stash.js';
import {addActivation, readState} from './state.js';
import {createSymlink, removeSymlink} from './symlink.js';
import type {
  Activation,
  Conflict,
  LinkRecord,
  Profile,
  Target,
} from './types.js';

export interface ActivateOptions {
  force?: boolean;
  dryRun?: boolean;
  onConflict?: (conflict: Conflict) => Promise<boolean>;
}

export interface ActivateResult {
  success: boolean;
  linksCreated: number;
  skipped: number;
  overridden: number;
  errors: string[];
}

export async function activateProfile(
  profile: Profile,
  target: Target,
  options: ActivateOptions = {},
): Promise<ActivateResult> {
  const targetDir = resolveTarget(
    target.kind,
    target.platform,
    target.kind === 'project' ? target.projectPath : undefined,
  );

  const state = await readState();
  if (
    state.activations.some(
      a =>
        a.profile === profile.name &&
        a.platform === target.platform &&
        a.target === target.kind &&
        (target.kind === 'global' || a.projectPath === target.projectPath),
    )
  ) {
    return {
      success: false,
      linksCreated: 0,
      skipped: 0,
      overridden: 0,
      errors: [
        `Profile "${profile.name}" is already active for ${target.platform}`,
      ],
    };
  }

  const conflicts = await detectConflicts(profile, targetDir);
  const result: ActivateResult = {
    success: true,
    linksCreated: 0,
    skipped: 0,
    overridden: 0,
    errors: [],
  };
  const createdLinks: LinkRecord[] = [];

  const items = resolveProfileItems(profile);

  for (const item of items) {
    const source = resolveSource(profile.path, item.type, item.name);
    let destination = resolveItemDestination(targetDir, item.type, item.name);
    let isGenerated = false;

    if (target.platform === 'gemini' && item.type === 'command') {
      destination = destination.replace(/\.md$/, '.toml');
      isGenerated = true;
    }

    const conflict = conflicts.find(
      c => c.name === item.name && c.type === item.type,
    );

    if (conflict) {
      if (conflict.kind === 'symlink-same-profile') {
        result.skipped++;
        continue;
      }

      if (conflict.kind === 'symlink-other-profile') {
        result.errors.push(
          `${item.name} is owned by active profile "${conflict.ownedByProfile}" - deactivate it first`,
        );
        continue;
      }

      if (conflict.kind === 'broken-symlink') {
        if (!options.dryRun) await removeSymlink(destination);
      } else if (conflict.kind === 'real-file') {
        if (!options.force && options.onConflict) {
          const proceed = await options.onConflict(conflict);
          if (!proceed) {
            result.skipped++;
            continue;
          }
        } else if (!options.force) {
          result.skipped++;
          continue;
        }

        if (!options.dryRun) {
          const stashPath = await stashOriginal(
            destination,
            profile.name,
            item.type,
            item.name,
          );
          createdLinks.push({
            type: item.type,
            name: item.name,
            source,
            destination,
            overrode: stashPath,
            isGenerated,
          });

          if (isGenerated) {
            const content = await fs.readFile(source, 'utf-8');
            const toml = generateCommandToml(content);
            await fs.mkdir(path.dirname(destination), {recursive: true});
            await fs.writeFile(destination, toml);
          } else {
            await createSymlink(source, destination);
          }

          result.overridden++;
          result.linksCreated++;
          continue;
        }
      }
    }

    if (!options.dryRun) {
      try {
        if (isGenerated) {
          const content = await fs.readFile(source, 'utf-8');
          const toml = generateCommandToml(content);
          await fs.mkdir(path.dirname(destination), {recursive: true});
          await fs.writeFile(destination, toml);
        } else {
          await createSymlink(source, destination);
        }

        createdLinks.push({
          type: item.type,
          name: item.name,
          source,
          destination,
          overrode: null,
          isGenerated,
        });
        result.linksCreated++;

        if (item.type === 'skill') {
          await restoreSkillConfig(destination, item.name);
        }
      } catch (err) {
        // Rollback previously created links
        for (const link of createdLinks) {
          try {
            if (link.isGenerated) {
              await fs.unlink(link.destination);
            } else {
              await removeSymlink(link.destination);
            }
          } catch {
            console.warn(
              `Failed to remove ${link.isGenerated ? 'file' : 'symlink'} at ${link.destination} during rollback. Manual cleanup may be required.`,
            );
          }
        }
        result.success = false;
        result.errors.push(
          `Failed to link ${item.name}: ${err instanceof Error ? err.message : String(err)}`,
        );
        return result;
      }
    } else {
      result.linksCreated++;
    }
  }

  if (!options.dryRun && createdLinks.length > 0) {
    const activation: Activation = {
      profile: profile.name,
      platform: target.platform,
      target: target.kind,
      projectPath: target.kind === 'project' ? target.projectPath : undefined,
      activatedAt: new Date().toISOString(),
      links: createdLinks,
    };
    await addActivation(activation);
    await injectDispatcher(targetDir, profile, target.platform);
  }

  return result;
}

function resolveProfileItems(
  profile: Profile,
): Array<{type: 'agent' | 'command' | 'skill'; name: string}> {
  return [
    ...profile.agents.map(a => ({type: 'agent' as const, name: a})),
    ...profile.commands.map(c => ({type: 'command' as const, name: c})),
    ...profile.skills.map(s => ({type: 'skill' as const, name: s})),
  ];
}

function resolveSource(
  profilePath: string,
  type: 'agent' | 'command' | 'skill',
  name: string,
): string {
  const subdir =
    type === 'agent' ? 'agents' : type === 'command' ? 'commands' : 'skills';
  return path.join(profilePath, subdir, name);
}

function generateCommandToml(content: string): string {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  let description = '';
  let prompt = content;

  if (match) {
    const yaml = match[1];
    prompt = match[2].trim();

    const descMatch = yaml.match(/^description:\s*(.*)$/m);
    if (descMatch) {
      description = descMatch[1].trim().replace(/^["']|["']$/g, '');
    }
  }

  let toml = '';
  if (description) {
    toml += `description = ${JSON.stringify(description)}\n`;
  }
  toml += `prompt = """\n${prompt}\n"""`;

  return toml;
}
