#!/usr/bin/env node
import {execSync} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

function main() {
  try {
    // Attempt to run obsidian whoami
    // We use the home directory to find the skill script as per the original shell script
    const scriptPath = path.join(
      os.homedir(),
      '.claude/skills/obsidian/scripts/obsidian.py',
    );
    const output = execSync(`python3 ${scriptPath} whoami`, {
      encoding: 'utf-8',
    });

    if (output) {
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: {
            additionalContext: output,
          },
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
