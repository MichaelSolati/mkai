import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import {resolveTarget, pkgRoot} from './config';
import type {Profile, Target} from './types';

// Helper to determine settings file path for permissions
export function resolvePermissionsFilePath(
  target: Target,
): string {
  const home = os.homedir();
  if (target.platform === 'claude') {
    const projectPath = target.kind === 'project' ? target.projectPath : undefined;
    const dir = resolveTarget(
      target.kind,
      'claude',
      projectPath,
    );
    return path.join(dir, 'settings.local.json');
  } else {
    // gemini
    if (target.kind === 'global') {
      return path.join(home, '.gemini', 'antigravity-cli', 'settings.json');
    } else {
      const projectPath = target.kind === 'project' ? target.projectPath : undefined;
      const dir = resolveTarget(
        'project',
        'gemini',
        projectPath,
      );
      return path.join(dir, 'settings.json');
    }
  }
}

// Generate the list of permission strings for a profile and platform
export async function generateProfilePermissions(
  profile: Profile,
  platform: 'claude' | 'gemini',
): Promise<string[]> {
  const permissions: string[] = [];
  if (!profile.permissions) return permissions;

  const home = os.homedir();
  const realRoot = pkgRoot();
  const mkaiSymlinkHome = path.join(home, '.mkai');
  const mkaiSymlinkTilde = '~/.mkai';

  // 1. Process skills permissions
  if (profile.permissions.skills) {
    for (const skillName of profile.permissions.skills) {
      if (platform === 'claude') {
        permissions.push(`Skill(${skillName})`);
      }
      // Gemini doesn't have a direct "Skill" permission concept, it only manages commands/files.
    }
  }

  // 2. Process scripts permissions
  if (profile.permissions.scripts) {
    for (const scriptRelPath of profile.permissions.scripts) {
      if (platform === 'claude') {
        // Claude wildcards
        permissions.push(`Bash(python3 */.mkai/profiles/${profile.name}/${scriptRelPath}*)`);
        permissions.push(`Bash(python */.mkai/profiles/${profile.name}/${scriptRelPath}*)`);
        permissions.push(`Bash(*/.mkai/profiles/${profile.name}/${scriptRelPath}*)`);

        permissions.push(`Bash(python3 ${realRoot}/profiles/${profile.name}/${scriptRelPath}*)`);
        permissions.push(`Bash(python ${realRoot}/profiles/${profile.name}/${scriptRelPath}*)`);
        permissions.push(`Bash(${realRoot}/profiles/${profile.name}/${scriptRelPath}*)`);
      } else {
        // Gemini command prefixes
        const roots = [realRoot, mkaiSymlinkHome, mkaiSymlinkTilde];
        for (const root of roots) {
          const scriptFullPath = path.join(root, 'profiles', profile.name, scriptRelPath);
          permissions.push(`command(python3 ${scriptFullPath})`);
          permissions.push(`command(python ${scriptFullPath})`);
          permissions.push(`command(${scriptFullPath})`);
        }
      }
    }
  }

  return permissions;
}

export async function addProfilePermissions(
  profile: Profile,
  target: Target,
): Promise<void> {
  const filePath = resolvePermissionsFilePath(target);
  const newPermissions = await generateProfilePermissions(profile, target.platform);

  if (newPermissions.length === 0) return;

  await fs.mkdir(path.dirname(filePath), {recursive: true});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let config: any = {};
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    config = JSON.parse(raw);
  } catch {
    // File doesn't exist or is invalid JSON, start fresh
  }

  if (!config.permissions) config.permissions = {};
  if (!config.permissions.allow) config.permissions.allow = [];

  const existingAllow = config.permissions.allow as string[];
  for (const perm of newPermissions) {
    if (!existingAllow.includes(perm)) {
      existingAllow.push(perm);
    }
  }

  await fs.writeFile(filePath, JSON.stringify(config, null, 2) + '\n');
}

export async function removeProfilePermissions(
  profile: Profile,
  target: Target,
): Promise<void> {
  const filePath = resolvePermissionsFilePath(target);
  const permissionsToRemove = await generateProfilePermissions(profile, target.platform);

  if (permissionsToRemove.length === 0) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let config: any = {};
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    config = JSON.parse(raw);
  } catch {
    return; // File doesn't exist, nothing to remove
  }

  if (!config.permissions || !config.permissions.allow) return;

  const existingAllow = config.permissions.allow as string[];
  config.permissions.allow = existingAllow.filter(
    (perm: string) => !permissionsToRemove.includes(perm),
  );

  // Clean up empty permissions object
  if (config.permissions.allow.length === 0) {
    delete config.permissions.allow;
  }
  if (config.permissions && Object.keys(config.permissions).length === 0) {
    delete config.permissions;
  }

  await fs.writeFile(filePath, JSON.stringify(config, null, 2) + '\n');
}
