---
description: Draft any text in your voice
argument-hint: <what to write, e.g. "Slack message to team about deploy freeze" or "LinkedIn post about WebAssembly">
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - Write
  - Edit
---

# /write — Write Anything in Your Voice

Load the **my-voice** skill from `~/.mkai/profiles/writing/skills/my-voice/SKILL.md`. It will instruct you to load your voice profile from Obsidian via `python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read identity/writing-voice.md`. If the vault file doesn't exist, tell the user to run `/voice-setup` first.

## Your Task

Write whatever the user describes in `$ARGUMENTS` using their authentic voice. This is the general-purpose command — use it for anything that isn't an email (`/email`) or design doc (`/design-doc`).

If the user doesn't provide enough context, ask for:

- What are you writing? (Slack message, LinkedIn post, talk abstract, README, PR description, comment, tweet, etc.)
- Who is the audience?
- What's the goal? (inform, persuade, announce, explain, etc.)

## Format Detection

Infer the right structure from the request. Common formats and how to handle them:

| Format | Personality Dial | Length | Key Guidance |
|---|---|---|---|
| Slack message | 90-100% | 1-5 sentences | Casual, direct, emoji okay if voice profile supports them |
| LinkedIn post | 80% | 100-300 words | Professional but human, no hashtag spam, no "I'm humbled to announce" |
| Talk/conference abstract | 70% | 150-300 words | Hook the reviewer, be specific about what attendees learn |
| README / documentation | 50-60% | Varies | Clear and direct, personality in asides not structure |
| PR description | 50% | 50-200 words | What changed, why, how to test — no fluff |
| Tweet / short post | 100% | Under 280 chars | Punchy, opinionated, one clear thought |
| Comment / review | 70-80% | Varies | Direct feedback, no hedging, constructive |
| Bio / about page | 80% | 50-200 words | Third or first person as requested, confident not braggy |
| Letter / formal writing | 40-50% | Varies | Voice still present but restrained, structure appropriate to context |

If the format doesn't match any of the above, use your judgment to set the personality dial based on how formal or casual the context is. Default to ~75% personality when unsure.

## Voice Constants (Always Apply)

Regardless of format:

- Use the user's vocabulary from their voice profile, not AI vocabulary — check the banned words list
- Vary sentence length — short punchy fragments mixed with longer explanations
- Be direct — say what you mean, don't hedge
- Quantify where relevant
- Address the reader naturally for the format
- No filler phrases, no throat-clearing, no sycophantic language
- Check anti-slop phrases and structures (respecting voice profile overrides)

## Voice Variables (Scale by Context)

Adjust these based on the detected format and audience, using the user's voice profile as the source for *how* these manifest:

- Humor frequency
- Parenthetical asides
- Pop culture references
- Emphasis (italics, bold, caps)
- Em dash usage (if allowed by voice profile)
- Formality of word choices

## Before Finishing

Run through the Anti-Patterns Checklist from the voice skill:

- [ ] No banned vocabulary
- [ ] Anti-slop phrases checked (respecting voice profile overrides)
- [ ] No filler phrase openers
- [ ] Tone matches the format and audience
- [ ] Sentence lengths vary
- [ ] At least one moment of personality (unless format is highly formal)
- [ ] Claims are quantified where possible
- [ ] No sycophantic or hedging language
- [ ] Length is appropriate for the format — don't over-write

After writing the draft, invoke the **style-reviewer** agent to check for AI-isms and voice drift.
