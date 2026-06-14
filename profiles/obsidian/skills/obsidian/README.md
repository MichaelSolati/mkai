# Obsidian — Digital Twin & Second Brain

An autonomous "Digital Twin" foundation for Claude Code, backed by an Obsidian vault. This skill captures your decisions, patterns, mistakes, and learnings across all spheres of life (work, personal, dating, projects) and provides a persistent identity for AI agents to represent you accurately.

Built on the Obsidian Local REST API plugin. Zero third-party dependencies.

## Key Concepts

- **Digital Twin Identity**: Your persona, preferences, and bio are stored in `identity/me.md`. AI agents use this to "become you" and act with your intent.
- **Second Brain**: Dynamic routing of knowledge into scoped folders (`projects/`, `personal/`, `dating/`, `work/`) with strict **lowercase-slug** naming.
- **Map of the Brain**: A unified index at `_meta/index.md` that lets agents quickly discover what you know without exhaustive folder crawling.

## Setup

### 1. Obsidian App (Windows/Mac/Linux)
Install the **Local REST API** plugin in Obsidian:
1. **Settings → Community Plugins** > Browse > search **"Local REST API"** > Install > Enable.
2. **Settings → Local REST API**:
   - Enable **Non-encrypted (HTTP) Server** (port 27123).
   - Copy the **API Key**.
   - (WSL Users) Enable **Non-Local Connections** if available, or ensure your firewall allows connections from the WSL IP.

### 2. Configure mkai
Create your local config:
```bash
cp profiles/obsidian/skills/obsidian/config.yaml.example profiles/obsidian/skills/obsidian/config.yaml
```
Paste your **API Key** and your **Windows Host IP** (if using WSL) into `config.yaml`.

### 3. Initialize your Twin
Run the setup command to verify connectivity and build your initial persona:
```bash
/brain-setup
```

## Commands

### Identity & Maintenance
- **`/brain-me`** — Prime the agent with your persona from `identity/me.md`.
- **`/brain-setup`** — Verify connection and initialize your identity document.
- **`/brain-map`** — Refresh the high-level brain index at `_meta/index.md`.
- **`/brain-status`** — Get a high-level overview of note distribution.
- **`/brain-health`** — Identify orphaned notes and broken wikilinks.

### Knowledge Capture
Use the `brain` skill directly (or via agent automation) to save notes:
```bash
python3 obsidian.py brain decision|pattern|mistake|learning "content" --scope global|work|dating|personal [--title "Title"]
```
*Note: All paths and filenames are automatically converted to **lowercase-slugs** (e.g., "My Project" → "my-project").*

## File Structure

```txt
profiles/obsidian/
├── profile.yaml              # mkai Profile definition
├── commands/
│   ├── brain-me.md           # Identity priming
│   ├── brain-setup.md        # Initialization
│   ├── brain-status.md       # Health overview
│   ├── brain-health.md       # Link analysis
│   └── brain-map.md          # Indexing
└── skills/obsidian/
    ├── SKILL.md              # Skill definition for agents
    ├── README.md             # You're here
    ├── config.yaml           # Local settings (gitignored)
    └── scripts/
        └── obsidian.py       # Core Digital Twin logic (REST-only)
```

## Workflow

1. **Morning Prime**: Run `/brain-me` at the start of your day.
2. **Autonomous Capture**: As you work, tell the agent "Save this decision to the <repo> brain."
3. **Weekly Cleanup**: Run `/brain-health` and `/brain-map` to keep your brain organized and navigable.
