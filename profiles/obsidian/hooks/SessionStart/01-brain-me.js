#!/usr/bin/env node
import {execSync} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

function main() {
  try {
    const scriptPath = path.join(
      os.homedir(),
      '.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py',
    );
    const output = execSync(`python3 ${scriptPath} whoami`, {
      encoding: 'utf-8',
    });

    if (output) {
      process.stdout.write(
        JSON.stringify({
          additionalContext: output,
          suppressOutput: true,
        }) + '\n',
      );
    }
  } catch {
    // If it fails, just exit silently
    process.exit(0);
  }
}

main();
