import os from 'os';
import path from 'path';
import {fileURLToPath} from 'url';

import type {Platform} from './types';

const HOME = os.homedir();

export function pkgRoot(): string {
  const thisFile = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(thisFile), '..');
}

function mkaiDataDir(): string {
  return path.join(pkgRoot(), '.data');
}

export const paths = {
  claudeDir: path.join(HOME, '.claude'),
  geminiDir: path.join(HOME, '.gemini'),
  get stateDir() {
    return mkaiDataDir();
  },
  get stateFile() {
    return path.join(mkaiDataDir(), 'state.json');
  },
  get stashDir() {
    return path.join(mkaiDataDir(), 'stash');
  },
  get configStashDir() {
    return path.join(mkaiDataDir(), 'stash', 'configs');
  },
  get originalsStashDir() {
    return path.join(mkaiDataDir(), 'stash', 'originals');
  },
};

export function profilesDir(): string {
  return path.join(pkgRoot(), 'profiles');
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
