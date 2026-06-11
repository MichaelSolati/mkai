---
description: Identify orphaned notes and broken wikilinks within the Obsidian vault.
allowed-tools:
  - obsidian
---

# /brain-health — Vault Link Analysis

This command crawls your vault to find notes that aren't linked to (orphans) or links that point to missing notes (unresolved).

## Script

```bash
python3 ~/.claude/skills/obsidian/scripts/obsidian.py link-health
```
