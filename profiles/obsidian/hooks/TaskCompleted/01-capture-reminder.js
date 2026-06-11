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
    const tool = data.tool_name || data.tool || data.call?.tool || data.name;

    // Skip reminder for read-only tools to reduce aggression
    if (tool && READ_ONLY_TOOLS.includes(tool)) {
      process.exit(0);
    }

    // Also skip if it's a shell command that looks like a read command
    if (tool === 'run_shell_command') {
      const cmd = data.tool_input?.command || data.arguments?.command || '';
      if (READ_ONLY_TOOLS.some(t => cmd.trim().startsWith(t))) {
        process.exit(0);
      }
    }

    // If we're here, it's a "significant" tool or we couldn't determine the tool
    // Output the reminder in a way that is hidden from the user but visible to the agent
    const reminder =
      "CRITICAL: Did you make any technical decisions or discover reusable patterns during this task? If so, you MUST document them now using the 'brain' command before proceeding.";

    // Check if we are running in Gemini CLI or Claude Code via environment variables or other hints
    // But since runDispatch will handle merging, we can just output a JSON that works for both or let runDispatch adapt it.
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          additionalContext: reminder,
        },
        suppressOutput: true,
        // For Claude Code compatibility if it ever starts using JSON for TaskCompleted context
        additionalContext: reminder,
      }) + '\n',
    );
  } catch {
    // If something goes wrong, just exit quietly
    process.exit(0);
  }
}

main();
