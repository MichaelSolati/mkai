import fs from 'fs/promises';
import path from 'path';

export async function findProjectRoot(
  startDir: string,
): Promise<string | null> {
  let current = startDir;
  while (true) {
    try {
      await fs.access(path.join(current, '.git'));
      return current;
    } catch {
      console.warn(`.git not found in ${current}, moving up...`);
    }
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, {recursive: true});
}
