# My Voice

Write in your authentic voice across any format. Combines a personal voice profile (stored in your Obsidian vault) with a universal anti-AI-slop baseline.

## How It Works

Three-layer priority system:

1. **L1 — Hard Rules** (unconditional): Always-banned vocabulary and phrases. Defined in `SKILL.md`. No override possible.
2. **L2 — General Styles** (suppressable): Anti-slop patterns that catch generic AI writing. Overridable by your personal profile. Defined in `references/anti-slop-*.md`.
3. **L3 — Personal Voice** (highest): Your vocabulary fingerprints, humor style, emphasis preferences, and any L2 rules your authentic writing naturally breaks. Stored in `identity/writing-voice.md` in your Obsidian vault.

When layers conflict, higher wins. If L2 bans em dashes but your voice profile says you use them, em dashes are allowed.

## Setup

```
/voice-setup
```

This reads 3–5 samples of your writing (blog posts, emails, docs, READMEs), analyzes your voice patterns, and writes a single file to your vault:

- `identity/writing-voice.md` — `## Voice Profile` (identity, vocab, overrides) + `## Sample Excerpts` (few-shot examples)

Your voice data stays in your vault, not in this repo.

## Enhancing Over Time

```
/voice-refresh
```

Run this with new writing samples to incrementally update your existing profile. Diffs the new samples against the current profile, shows you what would change, and on confirmation patches the vault file in place. Also logs the update to `identity/writing-voice-log.md`.

## Commands

| Command | What it does |
|---------|-------------|
| `/voice-setup` | Analyze your writing and generate a voice profile in the vault |
| `/voice-refresh` | Incrementally update an existing profile with new writing samples |
| `/write <anything>` | General-purpose writing — Slack messages, LinkedIn posts, talk abstracts, READMEs, PR descriptions, tweets, bios |
| `/email <recipient - purpose>` | Professional email with BLUF structure, tone scaled to recipient relationship |
| `/design-doc <feature>` | Design document with full structure (context, goals, non-goals, alternatives, trade-offs, rollout plan) |
| `/blog <topic>` | Blog post at full personality |

## Agent

The **style-reviewer** agent checks any draft for AI-isms, voice drift, and anti-slop violations (respecting your personal overrides). Writing commands invoke it automatically after drafting.

## File Structure

```
skills/my-voice/
  SKILL.md                          # Universal framework + L1 hard rules (tracked)
  README.md                         # This file (tracked)
  references/
    anti-slop-phrases.md            # L2 banned phrases (tracked)
    anti-slop-structures.md         # L2 structural anti-patterns (tracked)
    anti-slop-examples.md           # L2 before/after rewrite examples (tracked)
```

Personal voice data lives in the vault:
```
identity/
  writing-voice.md                  # ## Voice Profile + ## Sample Excerpts (vault only)
  writing-voice-log.md              # Append-only refresh log (vault only)
```

## Customizing

Re-run `/voice-refresh` any time with new writing samples to update your profile incrementally. Re-run `/voice-setup` to do a full regeneration from scratch.

The anti-slop references are universal L2 rules. If you disagree with a specific rule, override it in your voice profile's Anti-Slop Overrides section rather than editing the shared files.
