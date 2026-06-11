import os from 'os';
import path from 'path';
import {fileURLToPath} from 'url';

import type {Platform} from './types';

const HOME = os.homedir();

export const paths = {
  claudeDir: path.join(HOME, '.claude'),
  geminiDir: path.join(HOME, '.gemini'),
  stateDir: path.join(HOME, '.mkai'),
  stateFile: path.join(HOME, '.mkai', 'state.json'),
  stashDir: path.join(HOME, '.mkai', 'stash'),
  configStashDir: path.join(HOME, '.mkai', 'stash', 'configs'),
  originalsStashDir: path.join(HOME, '.mkai', 'stash', 'originals'),
};

export function profilesDir(): string {
  const thisFile = fileURLToPath(import.meta.url);
  const root = path.resolve(path.dirname(thisFile), '..');
  return path.join(root, 'profiles');
}

export function resolveTarget(
  target: 'global' | 'project',
  platform: Platform,
  projectPath?: string,
): string {
  const dirName = platform === 'claude' ? '.claude' : '.gemini';
  if (target === 'project' && projectPath) {
    return path.join(projectPath, dirName);
  }
  return platform === 'claude' ? paths.claudeDir : paths.geminiDir;
}

export function resolveItemDestination(
  targetDir: string,
  type: 'agent' | 'command' | 'skill',
  name: string,
): string {
  const subdir =
    type === 'agent' ? 'agents' : type === 'command' ? 'commands' : 'skills';
  return path.join(targetDir, subdir, name);
}
