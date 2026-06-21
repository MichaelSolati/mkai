# Writing

Write in your authentic voice. Combines a personal voice profile (stored in your Obsidian vault) with a universal anti-AI-slop baseline.

## Requirements

Requires the `obsidian` profile to be active — your voice profile lives in the vault at `identity/writing-voice.md`.

```bash
mkai activate obsidian writing
```

### Migrating from the old `~/.mkai/profiles/writing/~/.mkai/profiles/writing/skills/my-voice/` setup

If you previously had `my-voice` installed directly in `~/.claude/`, those files will conflict with this profile. Remove them first (or use `--force` to let mkai stash them):

```bash
# Option A: remove the old files manually
rm -rf ~/.claude/skills/my-voice
rm ~/.claude/commands/write.md ~/.claude/commands/blog.md
rm ~/.claude/commands/email.md ~/.claude/commands/design-doc.md
rm ~/.claude/commands/voice-setup.md
rm ~/.claude/agents/style-reviewer.md

# Option B: let mkai stash them
mkai activate writing --force
```

Your existing `~/.mkai/profiles/writing/~/.mkai/profiles/writing/skills/my-voice/references/voice-profile.md` is NOT deleted by either approach. Run `/voice-setup` after activating — it will detect the old local files and offer to migrate them to the vault.

## How It Works

Three-layer priority system:

1. **Hard Rules (L1)** — Always-banned vocabulary and phrases. No override. Defined in `~/.mkai/profiles/writing/skills/my-voice/SKILL.md`.
2. **General Styles (L2)** — Anti-slop patterns that catch generic AI writing. Overridable by your personal profile. Defined in `~/.mkai/profiles/writing/skills/my-voice/references/anti-slop-*.md`.
3. **Personal Voice (L3)** — Your vocabulary fingerprints, humor style, emphasis patterns, and anti-slop overrides. Stored in `identity/writing-voice.md` in your Obsidian vault.

When layers conflict, higher wins.

## Setup

If you don't have a voice profile yet, run:

```
/voice-setup
```

This reads 3–5 samples of your writing, analyzes your voice, and writes `identity/writing-voice.md` to your vault.

## Commands

| Command | What it does |
|---------|-------------|
| `/voice-setup` | Analyze your writing and generate a voice profile in the vault |
| `/voice-refresh` | Incrementally update an existing profile with new writing samples |
| `/write <anything>` | General-purpose writing — Slack messages, LinkedIn posts, READMEs, PR descriptions, tweets, bios |
| `/email <recipient - purpose>` | Professional email with BLUF structure, tone scaled to recipient |
| `/design-doc <feature>` | Design document with full structure (context, goals, non-goals, alternatives, trade-offs, rollout) |
| `/blog <topic>` | Blog post at full personality |

## File Structure

```
profiles/writing/
  profile.yaml
  README.md
  agents/
    style-reviewer.md            # Checks drafts for AI-isms and voice drift
  commands/
    write.md / blog.md / email.md / design-doc.md
    voice-setup.md               # Initial profile generation
    voice-refresh.md             # Incremental update
  skills/
    my-voice/
      SKILL.md                   # Universal framework + L1 hard rules (tracked)
      README.md
      references/
        anti-slop-phrases.md     # L2 banned phrases (tracked)
        anti-slop-structures.md  # L2 structural anti-patterns (tracked)
        anti-slop-examples.md    # L2 before/after examples (tracked)
```

Personal voice data (`identity/writing-voice.md`, `identity/writing-voice-log.md`) lives in your Obsidian vault — not in this repo.
