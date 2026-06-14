#!/usr/bin/env node
/**
 * 01-memory-hijack.js — mkai Hook: Intercept native memory and redirect to Obsidian
 *
 * This hook blocks tool calls that attempt to use Claude's native memory
 * or CLAUDE.md for persistent context, forcing the agent to use the Obsidian skill.
 */

import fs from 'node:fs';

function main() {
  const payload = fs.readFileSync(0, 'utf-8');
  if (!payload) process.exit(0);

  try {
    const data = JSON.parse(payload);

    // Claude Code payload structure for PreToolUse
    const tool = data.tool_name || data.tool || data.call?.tool || data.name;
    const args =
      data.tool_input || data.arguments || data.call?.arguments || data.args;

    // Check if the agent is trying to read/write/grep native memory or CLAUDE.md/GEMINI.md
    // We also include the project-specific memory path used by Claude Code and Gemini CLI
    const targetPatterns = [
      '\\.claude/memory',
      '\\.gemini/memory',
      'CLAUDE\\.md',
      'GEMINI\\.md',
      '\\.claude/projects/.*/memory',
      '\\.claude/projects/.*-memory',
      '\\.gemini/projects/.*/memory',
      'memory/.*\\.md',
      'memory/.*',
    ];

    const argsStr = args ? JSON.stringify(args) : '';

    if (!tool || !args) {
      process.exit(0);
    }

    const isMemoryCall = targetPatterns.some(pattern => {
      const regex = new RegExp(pattern, 'i');
      return regex.test(argsStr);
    });

    if (isMemoryCall) {
      console.log(
        JSON.stringify({
          decision: 'deny', // 'deny' is preferred in Gemini CLI, 'block' works in Claude
          permissionDecision: 'deny', // For Claude Code JSON protocol
          reason:
            'Native memory is disabled. You MUST use the obsidian skill for persistent memory. Run `python3 ~/.claude/skills/obsidian/scripts/obsidian.py brain` to save, or `... search` to find context.',
          suppressOutput: true,
        }),
      );
      // Exit with 0 so the CLI parses the JSON decision correctly.
      // Claude Code also handles JSON on stdout with exit 0 for PreToolUse.
      process.exit(0);
    }
  } catch {
    // Malformed JSON or other error, proceed safely
    process.exit(0);
  }

  process.exit(0);
}

main();
