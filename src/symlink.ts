import fs from "node:fs/promises";
import path from "node:path";

export async function createSymlink(source: string, destination: string): Promise<void> {
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.symlink(source, destination);
}

export async function removeSymlink(destination: string): Promise<void> {
  const stat = await fs.lstat(destination);
  if (!stat.isSymbolicLink()) {
    throw new Error(`${destination} is not a symlink - refusing to remove`);
  }
  await fs.unlink(destination);
}

export async function isSymlink(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.lstat(filePath);
    return stat.isSymbolicLink();
  } catch {
    return false;
  }
}

export async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.lstat(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function isHealthySymlink(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.lstat(filePath);
    if (!stat.isSymbolicLink()) return false;
    await fs.stat(filePath); // follows symlink - throws if target missing
    return true;
  } catch {
    return false;
  }
}
