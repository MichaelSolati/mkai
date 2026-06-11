# mkai

AI Profile Loader - activate and deactivate groups of agents, skills, and commands for multiple coding agents (Claude Code, Gemini CLI, etc) via symlinks.

## Install

```bash
npm install
```

This will automatically build the project and link the `mkai` binary globally.

## Usage

```bash
mkai                        # Interactive TUI dashboard
mkai list                   # Show available profiles
mkai activate <profiles..>  # Activate profiles
mkai deactivate <profiles..># Deactivate profiles
mkai status                 # Show currently active profiles
mkai check                  # Validate symlink health
mkai init <name>            # Scaffold a new profile
```

### Terminal User Interface (TUI)

Running `mkai` without arguments launches a persistent React-based dashboard.

- **[↑/↓] Navigate**: Select profiles from the list.
- **[Enter/Space] Actions**: Open a modal to pick Platform/Target and Activate/Deactivate.
- **[s] Details**: View a detailed breakdown of agents, commands, and skills for the selected profile.
- **[c] Health Check**: Run a real-time validation of all active symlinks.
- **[q] Quit**: Exit the TUI.

### Flags & Options

| Flag | Command | Effect |
|------|---------|--------|
| `-p, --platform <platform>` | activate, deactivate | Target platform (`claude` or `gemini`). Default: `claude` |
| `-t, --target <target>` | activate, deactivate | Target location (`global` or `project`). Default: `global` (or `all` for deactivate) |
| `--force` | activate | Override file conflicts without prompting |
| `--dry-run` | activate, deactivate | Preview changes without modifying the filesystem |
| `--all` | deactivate | Deactivate all active profiles |
| `--json` | list, status | Machine-readable output |

**Example One-Liners:**
```bash
# Activate engineering profile for Claude globally
mkai activate engineering --platform claude --target global

# Deactivate obsidian profile for Gemini in the current project
mkai deactivate obsidian --platform gemini --target project
```

## How it works

Each profile is a directory under `profiles/` containing a `profile.yaml` manifest and subdirectories for agents, commands, and skills.

When activated, `mkai` creates symlinks in the target directory (e.g., `~/.claude/` or `~/.gemini/`) pointing back to the profile source. Deactivation safely removes these links. State is persisted in `~/.mkai/state.json`.

If a symlink would overwrite an existing file, `mkai` stashes the original and restores it on deactivation.

## Profiles

| Profile | Contents | Description |
|---------|----------|-------------|
| **dating** | 3 skills | Research-backed dating profile optimization and messaging grounded in signaling theory, behavioral research, and platform data |
| **engineering** | 4 commands, 4 skills | TDD, debugging, architecture improvement, and disciplined development workflows |
| **flutter** | 2 skills | Flutter/Dart development - testing patterns and OWASP mobile security scanning |
| **game-dev** | 53 agents, 75 skills | Complete game development studio - 53 specialist agents and 75 skills covering design, programming, art, audio, QA, and production |
| **marketing** | 4 skills | CRO, copywriting, cold email, pricing strategy, and growth skills |
| **productivity** | 3 commands, 6 skills | Meta-skills for working with AI - prompt engineering, handoffs, issue management, PRDs |
| **real-estate** | 5 agents, 15 skills | Property analysis, listing evaluation, market research, investment analysis, and client management |
| **research** | 3 agents, 2 commands, 2 skills | Academic paper writing, deep research, literature review, and synthesis pipelines |
| **seo-geo** | 1 command, 10 skills | Search engine optimization AND generative engine optimization (AI citation optimization) |
| **site-cloner** | 1 skill | Reverse-engineer any website into Next.js using chrome-devtools for page inspection and parallel builder agents |
| **ui-ux-design** | 14 skills | App design, social media platforms, magazine layouts, editorial design, and anti-AI-slop rules |

## Creating a profile

```bash
mkai init my-profile
```

Edit `profiles/my-profile/profile.yaml`:

```yaml
name: my-profile
description: What this profile does
tags: [relevant, tags]

agents:
  - my-agent.md

commands:
  - my-command.md

skills:
  - my-skill

requires: []
conflicts: []
```

- **Agents** are markdown files in `agents/` - symlinked to `agents/` in the target platform folder.
- **Commands** are markdown files in `commands/` - symlinked to `commands/` in the target platform folder.
- **Skills** are directories in `skills/` containing a `SKILL.md` - symlinked to `skills/` in the target platform folder.

## Development

```bash
npm run dev    # watch mode
npm test       # run tests
```
