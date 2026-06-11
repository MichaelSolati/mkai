---
name: obsidian
description: >
  Autonomous second brain and Digital Twin identity management.
  Captures decisions, patterns, mistakes, and learnings with scoped routing (global/repo/branch/category).
  Provides user identity context for agents.
allowed-tools:
  - Bash
  - Read
---

# Obsidian — Digital Twin & Second Brain

Script: `{baseDir}/scripts/obsidian.py`

## Commands

```bash
# ─── Digital Twin Identity ──────────────────────────────────────────────────
# whoami: pull your persona and context from the vault
python3 {baseDir}/scripts/obsidian.py whoami

# index-update: rebuild the vault's map in _meta/index.md
python3 {baseDir}/scripts/obsidian.py index-update

# setup: verify connectivity and identity document
python3 {baseDir}/scripts/obsidian.py setup

# ─── Vault Health ───────────────────────────────────────────────────────────
# vault-status: get an overview of note distribution and staleness
python3 {baseDir}/scripts/obsidian.py vault-status [--stale-days 60]

# link-health: find orphaned notes and broken wikilinks
python3 {baseDir}/scripts/obsidian.py link-health [--top N]

# ─── Knowledge Capture ───────────────────────────────────────────────────────
# brain: route knowledge to the correct scoped file (creates paths dynamically)
# scope: global | <repo> | <repo>/<branch> | <category>
python3 {baseDir}/scripts/obsidian.py brain decision|pattern|mistake|question|learning "content" --scope global|work|dating|personal [--title T] [--ref repo:file:line]

# ─── Vault Operations ───────────────────────────────────────────────────────
# Search & context
python3 {baseDir}/scripts/obsidian.py search "query"
python3 {baseDir}/scripts/obsidian.py context "query" [--top N]
python3 {baseDir}/scripts/obsidian.py read "path/to/note.md" [--heading "Section"] [--frontmatter "field"] [--map]

# Write & Edit
python3 {baseDir}/scripts/obsidian.py write "path/to/note.md" "content"
python3 {baseDir}/scripts/obsidian.py append "path/to/note.md" "content"
python3 {baseDir}/scripts/obsidian.py patch "path" "content" --target-type heading|block|frontmatter --target "name" [--operation append|prepend|replace] [--create-if-missing]

# Metadata
python3 {baseDir}/scripts/obsidian.py init "path/to/note.md" --type note|meeting|decision|rfc|project --title T [--status draft|active|review]
python3 {baseDir}/scripts/obsidian.py meta "path" --show
python3 {baseDir}/scripts/obsidian.py meta "path" --set key=value
```

## Workflow

1. **Prime the Agent** — Run `/brain-me` at the start of a session so the agent knows who you are and your preferences.
2. **Setup and Map** — Use `/brain-setup` to initialize and `/brain-map` to refresh your vault's high-level index.
3. **Save Decisions** — Use `brain decision --scope <repo>` to track architectural choices.
4. **Capture Mistakes** — Use `brain mistake --scope global` for cross-cutting "lessons learned" to avoid repeating them.
5. **Vault Health** — Monitor your brain's navigability with `/brain-status` and `/brain-health`.

## Automated Hooks

This profile includes active lifecycle hooks to ensure vault integration:
- **SessionStart**: Automatically primes your identity from `identity/me.md`.
- **PreToolUse**: Hijacks native memory access (e.g. `.claude/memory`, `CLAUDE.md`) and redirects you to use the Obsidian skill instead.
- **TaskCompleted**: Reminds you to document significant decisions or patterns before finishing a task.
