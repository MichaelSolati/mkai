import os from 'os';
import path from 'path';
import {fileURLToPath} from 'url';

const HOME = os.homedir();

export const paths = {
  claudeDir: path.join(HOME, '.claude'),
  stateDir: path.join(HOME, '.claude-profiles'),
  stateFile: path.join(HOME, '.claude-profiles', 'state.json'),
  stashDir: path.join(HOME, '.claude-profiles', 'stash'),
  configStashDir: path.join(HOME, '.claude-profiles', 'stash', 'configs'),
  originalsStashDir: path.join(HOME, '.claude-profiles', 'stash', 'originals'),
};

export function profilesDir(): string {
  const thisFile = fileURLToPath(import.meta.url);
  const root = path.resolve(path.dirname(thisFile), '..');
  return path.join(root, 'profiles');
}

export function resolveTarget(
  target: 'global' | 'project',
  projectPath?: string,
): string {
  if (target === 'project' && projectPath) {
    return path.join(projectPath, '.claude');
  }
  return paths.claudeDir;
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
