---
description: Pull user identity, persona, and preferences from the Obsidian vault to prime the agent.
allowed-tools:
  - obsidian
---

# /brain-me — Digital Twin Identity

This command primes the agent with your personal context stored in Obsidian. It allows the agent to "be you" by understanding your role, preferences, and current focus.

## Script

```bash
python3 ~/.claude/skills/obsidian/scripts/obsidian.py whoami
```

## Workflow

1.  **Read Identity**: Run the `/brain-me` command.
2.  **Internalize**: Read the output and adjust your persona to match the user's documented identity and preferences.
3.  **Acknowledge**: Briefly confirm to the user that you've internalized their context (e.g., "I've loaded your identity from the vault. I'm ready to act as your [Role].")
