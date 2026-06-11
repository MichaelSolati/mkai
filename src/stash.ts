import fs from 'fs/promises';
import path from 'path';

import {paths} from './config.js';

export async function stashOriginal(
  originalPath: string,
  profileName: string,
  type: 'agent' | 'command' | 'skill',
  name: string,
): Promise<string> {
  const stashPath = path.join(paths.originalsStashDir, profileName, type, name);
  await fs.mkdir(path.dirname(stashPath), {recursive: true});

  const stat = await fs.stat(originalPath);
  if (stat.isDirectory()) {
    await fs.cp(originalPath, stashPath, {recursive: true});
    await fs.rm(originalPath, {recursive: true});
  } else {
    await fs.copyFile(originalPath, stashPath);
    await fs.unlink(originalPath);
  }

  return stashPath;
}

export async function restoreOriginal(
  stashPath: string,
  originalPath: string,
): Promise<void> {
  await fs.mkdir(path.dirname(originalPath), {recursive: true});

  const stat = await fs.stat(stashPath);
  if (stat.isDirectory()) {
    await fs.cp(stashPath, originalPath, {recursive: true});
    await fs.rm(stashPath, {recursive: true});
  } else {
    await fs.copyFile(stashPath, originalPath);
    await fs.unlink(stashPath);
  }
}

export async function stashSkillConfig(
  skillDir: string,
  skillName: string,
): Promise<void> {
  const configPath = path.join(skillDir, 'config.yaml');
  try {
    await fs.access(configPath);
  } catch {
    return; // No config to stash
  }

  const stashPath = path.join(paths.configStashDir, skillName, 'config.yaml');
  await fs.mkdir(path.dirname(stashPath), {recursive: true});
  await fs.copyFile(configPath, stashPath);
}

export async function restoreSkillConfig(
  skillDir: string,
  skillName: string,
): Promise<void> {
  const stashPath = path.join(paths.configStashDir, skillName, 'config.yaml');
  try {
    await fs.access(stashPath);
  } catch {
    return; // No stashed config
  }

  const configPath = path.join(skillDir, 'config.yaml');
  await fs.copyFile(stashPath, configPath);
  await fs.unlink(stashPath);
}
