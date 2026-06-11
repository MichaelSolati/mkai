import fs from 'fs/promises';

import {resolveTarget} from './config';
import {removeDispatcher} from './hooks/manager';
import {restoreOriginal, stashSkillConfig} from './stash';
import {readState, removeActivation} from './state';
import {isSymlink, removeSymlink} from './symlink';
import type {Target} from './types';

export interface DeactivateResult {
  success: boolean;
  linksRemoved: number;
  restored: number;
  errors: string[];
}

export async function deactivateProfile(
  profileName: string,
  target: Target,
  options: {dryRun?: boolean} = {},
): Promise<DeactivateResult> {
  const result: DeactivateResult = {
    success: true,
    linksRemoved: 0,
    restored: 0,
    errors: [],
  };

  const projectPath =
    target.kind === 'project' ? target.projectPath : undefined;
  const activation = await removeActivation(
    profileName,
    target.kind,
    target.platform,
    projectPath,
  );

  if (!activation) {
    return {
      success: false,
      linksRemoved: 0,
      restored: 0,
      errors: [`Profile "${profileName}" is not active on ${target.platform}`],
    };
  }

  if (options.dryRun) {
    return {
      success: true,
      linksRemoved: activation.links.length,
      restored: activation.links.filter(l => l.overrode).length,
      errors: [],
    };
  }

  for (const link of activation.links) {
    try {
      if (link.type === 'skill') {
        await stashSkillConfig(link.destination, link.name);
      }

      if (link.isGenerated) {
        await fs.unlink(link.destination);
        result.linksRemoved++;
      } else if (await isSymlink(link.destination)) {
        await removeSymlink(link.destination);
        result.linksRemoved++;
      }

      if (link.overrode) {
        await restoreOriginal(link.overrode, link.destination);
        result.restored++;
      }
    } catch (err) {
      result.errors.push(
        `Failed to remove ${link.name}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  if (result.errors.length > 0) result.success = false;

  const targetDir = resolveTarget(
    target.kind,
    target.platform,
    target.kind === 'project' ? target.projectPath : undefined,
  );
  await removeDispatcher(targetDir, target.platform);

  return result;
}

export async function deactivateAll(
  options: {dryRun?: boolean} = {},
): Promise<DeactivateResult> {
  const state = await readState();
  const combined: DeactivateResult = {
    success: true,
    linksRemoved: 0,
    restored: 0,
    errors: [],
  };

  for (const activation of [...state.activations]) {
    const target: Target =
      activation.target === 'project' && activation.projectPath
        ? {
            kind: 'project',
            projectPath: activation.projectPath,
            platform: activation.platform,
          }
        : {kind: 'global', platform: activation.platform};

    const result = await deactivateProfile(activation.profile, target, options);
    combined.linksRemoved += result.linksRemoved;
    combined.restored += result.restored;
    combined.errors.push(...result.errors);
    if (!result.success) combined.success = false;
  }

  return combined;
}
