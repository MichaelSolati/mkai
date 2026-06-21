---
description: Draft a professional email in your voice
argument-hint: <recipient and purpose, e.g. "manager - request PTO next week">
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - Write
  - Edit
---

# /email — Write a Professional Email in Your Voice

Load the **my-voice** skill from `~/.mkai/profiles/writing/skills/my-voice/SKILL.md`. It will instruct you to load your voice profile from Obsidian via `python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read identity/writing-voice.md`. If the vault file doesn't exist, tell the user to run `/voice-setup` first.

## Your Task

Write a professional email based on the context provided in `$ARGUMENTS`. The arguments should include who the email is to and the purpose. If the user doesn't provide enough context, ask for:

- Who is the recipient? (peer, manager, skip-level, external client)
- What's the purpose? (request, update, feedback, introduction, follow-up)
- Any specific details to include?

## Email Structure

Use **BLUF (Bottom Line Up Front)** — state the purpose or ask in the very first sentence.

### Format by Email Type

**Request / Ask Email:**

1. State the ask directly in sentence one
2. Provide brief context (2-3 sentences max)
3. Include any deadlines or constraints
4. Close warmly

**Status / Update Email:**

1. TL;DR — one-sentence summary of where things stand
2. Completed (bullet points)
3. In Progress (bullet points)
4. Risks or blockers (if any)
5. Next steps

**Feedback Email:**

1. Lead with what's working well (specific, not generic praise)
2. Frame suggestions as questions where possible ("Have you considered...?")
3. Close with overall direction and support

**Ask-for-Help Email:**

1. State what you need help with
2. Brief context on what you've tried
3. Your hypothesis or best guess
4. No false urgency — be honest about timeline

## Voice Dial: Scales with Relationship

Adjust personality based on the recipient context from `$ARGUMENTS`:

| Recipient | Formality | Warmth | Personality | Humor |
|---|---|---|---|---|
| Peer / teammate | Low | High | Full voice | Yes |
| Manager / direct report | Low-medium | High | ~80% | Occasionally |
| Skip-level / senior leader | Medium | Moderate | ~50% | Rarely |
| External client / partner | Medium-high | Moderate | ~40% | No |

### Constants (Always Apply)

- Direct, no hedging — say what you mean
- Quantify when relevant ("3 items left", not "a few things")
- No filler phrases: "I hope this email finds you well", "Per my last email", "Please do not hesitate"
- No sycophantic openers: "Great question!", "Thanks for the amazing work!"
- Conversational word choices over formal ones ("use" not "utilize", "help" not "facilitate")
- Check anti-slop phrases (respecting voice profile overrides)

### Variables (Scale by Context)

- Use the voice profile to determine *how* these manifest for this specific user:
- Parenthetical asides: frequent with peers, rare with execs
- Pop culture references: only with close peers
- Exclamation points: natural with peers, minimal with formal contacts
- Emphasis tools: light — emails are short enough that emphasis should be structural

## Length Target

50-300 words. Emails should be scannable. If it's getting longer than 300 words, consider whether it should be a document instead.

## Subject Line

Generate a clear, specific subject line. Not clever — functional.

- Good: "PTO Request: Dec 23-27"
- Good: "Q4 Sprint Review — 3 items need input"
- Bad: "Quick question"
- Bad: "Following up"
- Bad: "Thoughts?"

## Before Finishing

Check:

- [ ] Purpose is clear in the first sentence
- [ ] No banned filler phrases
- [ ] Anti-slop phrases checked (respecting voice profile overrides)
- [ ] Tone matches the recipient relationship
- [ ] Under 300 words
- [ ] Subject line is specific and functional
- [ ] No AI-isms slipped in
