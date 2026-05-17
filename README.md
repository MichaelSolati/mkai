# cpx

Claude Profile Loader - activate and deactivate groups of agents, skills, and commands for Claude Code via symlinks.

## Install

```bash
npm install
npm run build
npm link
```

After linking, `cpx` is available globally.

## Usage

```bash
cpx                        # interactive TUI
cpx list                   # show available profiles
cpx activate <profiles..>  # symlink a profile into ~/.claude/
cpx deactivate <profiles..># remove symlinks
cpx status                 # show what's active
cpx check                  # validate symlink health
cpx init <name>            # scaffold a new profile
```

### Flags

| Flag | Command | Effect |
|------|---------|--------|
| `--project` | activate | Install into `./.claude/` instead of `~/.claude/` |
| `--force` | activate | Override file conflicts without prompting |
| `--dry-run` | activate, deactivate | Preview without making changes |
| `--all` | deactivate | Remove all active profiles |
| `--json` | list, status | Machine-readable output |

## How it works

Each profile is a directory under `profiles/` containing a `profile.yaml` manifest and subdirectories for agents, commands, and skills:

```
profiles/engineering/
  profile.yaml
  agents/
  commands/
    context-prime.md
    focused-fix.md
    optimize.md
  skills/
    diagnose/
    improve-architecture/
    prototype/
    tdd/
```

When activated, cpx creates symlinks from `~/.claude/{agents,commands,skills}/` pointing into the profile directory. Deactivation removes them. State is tracked in `~/.claude-profiles/state.json`.

If a symlink would overwrite an existing file, cpx stashes the original and restores it on deactivation.

## Profiles

| Profile | Contents | Description |
|---------|----------|-------------|
| **dating** | 3 skills | Research-backed dating profile optimization and messaging grounded in signaling theory, behavioral research, and platform data |
| **engineering** | 4 commands, 4 skills | TDD, debugging, architecture improvement, and disciplined development workflows |
| **flutter** | 2 skills | Flutter/Dart development - testing patterns and OWASP mobile security scanning |
| **game-dev** | 53 agents, 75 skills | Complete game development studio - 53 specialist agents and 75 skills covering design, programming, art, audio, QA, and production |
| **marketing** | 4 skills | CRO, copywriting, cold email, pricing strategy, and growth skills |
| **productivity** | 3 commands, 6 skills | Meta-skills for working with Claude - prompt engineering, handoffs, issue management, PRDs |
| **real-estate** | 5 agents, 15 skills | Property analysis, listing evaluation, market research, investment analysis, and client management |
| **research** | 3 agents, 2 commands, 2 skills | Academic paper writing, deep research, literature review, and synthesis pipelines |
| **seo-geo** | 1 command, 10 skills | Search engine optimization AND generative engine optimization (AI citation optimization) |
| **site-cloner** | 1 skill | Reverse-engineer any website into Next.js using chrome-devtools for page inspection and parallel builder agents |
| **ui-ux-design** | 14 skills | App design, social media platforms, magazine layouts, editorial design, and anti-AI-slop rules |

## Creating a profile

```bash
cpx init my-profile
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

- **Agents** are markdown files in `agents/` - symlinked to `~/.claude/agents/`
- **Commands** are markdown files in `commands/` - symlinked to `~/.claude/commands/`
- **Skills** are directories in `skills/` containing a `SKILL.md` - symlinked to `~/.claude/skills/`

### Cross-skill references

When one skill references another skill's files, use the absolute installed path:

```
~/.claude/skills/other-skill/references/something.md
```

## Development

```bash
npm run dev    # watch mode
npm test       # run tests
```
