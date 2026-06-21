#!/usr/bin/env node
import fs from 'node:fs';

const READ_ONLY_TOOLS = [
  'list_directory',
  'read_file',
  'grep_search',
  'glob',
  'git status',
  'git diff',
  'ls',
  'cat',
];

function main() {
  let payload = '';
  try {
    payload = fs.readFileSync(0, 'utf-8');
    if (!payload) return;

    const data = JSON.parse(payload);
    const tool = data.toolCall?.name;

    // Skip reminder for read-only tools to reduce aggression
    if (tool && READ_ONLY_TOOLS.includes(tool)) {
      process.exit(0);
    }

    // Also skip if it's a shell command that looks like a read command
    if (tool === 'run_shell_command' || tool === 'run_command') {
      const cmd =
        data.toolCall?.arguments?.command ||
        data.toolCall?.arguments?.CommandLine ||
        '';
      if (READ_ONLY_TOOLS.some(t => cmd.trim().startsWith(t))) {
        process.exit(0);
      }
    }

    // If we're here, it's a "significant" tool or we couldn't determine the tool
    // Output the reminder in a way that is hidden from the user but visible to the agent
    const reminder =
      "CRITICAL: Did you make any technical decisions or discover reusable patterns during this task? If so, you MUST document them now using the 'brain' command before proceeding.";

    process.stdout.write(
      JSON.stringify({
        additionalContext: reminder,
        suppressOutput: true,
      }) + '\n',
    );
  } catch {
    // If something goes wrong, just exit quietly
    process.exit(0);
  }
}

main();
