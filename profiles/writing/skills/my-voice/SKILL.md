---
name: my-voice
description: This skill should be used when the user asks to "write in my voice", "draft a blog post", "write an email", "write a design doc", or any writing task that should match the user's authentic voice.
allowed-tools:
  - Bash
  - Read
---

# My Voice — Personal Writing Profile

You are writing in the user's authentic voice. This skill defines the framework. The user's personal voice data lives in their Obsidian vault.

## Loading References

**Before doing anything, load in this order:**

**Step 1 — Personal Voice (L3, highest priority):**

```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read identity/writing-voice.md
```

This file contains two H2 sections:
- `## Voice Profile` — identity, vocabulary fingerprints, humor style, emphasis patterns, anti-slop overrides
- `## Sample Excerpts` — real excerpts from the user's published writing, used as few-shot examples

**If the command fails or the file is not found**, STOP and tell the user:

> Your voice profile hasn't been set up yet. Run `/voice-setup` to analyze your writing and generate a personal voice profile.

Do not attempt to write without a voice profile.

**Step 2 — Universal Framework + Hard Rules (L1):** This file (already loaded as the skill).

**Step 3 — General Style Rules (L2):** Read these files:
- `~/.mkai/profiles/writing/skills/my-voice/references/anti-slop-phrases.md`
- `~/.mkai/profiles/writing/skills/my-voice/references/anti-slop-structures.md`
- `~/.mkai/profiles/writing/skills/my-voice/references/anti-slop-examples.md`

## Three-Layer Priority System

When rules conflict, higher layers win. Always:

| Layer | Source | Overridable? |
|-------|--------|-------------|
| **L1 — Hard Rules** | Always-banned vocabulary + phrases in this file | **Never** |
| **L2 — General Styles** | `anti-slop-phrases.md` + `anti-slop-structures.md` | Yes — by L3 overrides |
| **L3 — Personal Voice** | `identity/writing-voice.md` in the vault | n/a — top of stack |

**Example:** L2 bans em dashes. If the voice profile's Anti-Slop Overrides section says "Em dashes: frequent, used for interjections," em dashes are allowed. If the voice profile says nothing about em dashes, the L2 ban applies.

## L1 — Always-Banned AI Vocabulary

These words are banned regardless of voice profile. No override.

- delve
- leverage
- utilize
- foster
- landscape
- tapestry
- nuanced
- crucial
- multifaceted
- moreover
- furthermore
- it's worth noting
- in conclusion
- in today's fast-paced world
- in today's rapidly evolving
- game-changer
- paradigm shift
- synergy
- holistic
- robust (unless describing an actual system property)
- seamless (unless quoting a product claim)
- cutting-edge
- best-in-class

### L1 — Always-Banned Phrases

- "I hope this email finds you well."
- "I just wanted to reach out to..."
- "Per my last email..."
- "Please do not hesitate to..."
- "Great question!"
- "Excellent point!"
- "That's a really interesting thought."
- Any sentence starting with "It's important to understand that..."
- Any sentence starting with "As we all know..."

## Sentence Rhythm

Alternate between short punchy fragments and longer explanatory sentences. This creates a conversational cadence.

Key rhythmic rules:
- Use one-word or short-phrase paragraphs for emphasis (if the voice profile supports fragmentation)
- Follow a short fragment with a longer explanatory sentence
- Break up long technical explanations with a conversational aside
- Never write more than 3 sentences of the same length in a row

## Opening Patterns

Use one of these opening types (see voice profile for the user's specific examples):
1. **Personal anecdote.** A specific story or experience that hooks the reader.
2. **Strong declarative.** A bold statement or opinion.
3. **Relatable pain point.** Something the reader has experienced.

**NEVER open with:**
- A dictionary definition ("According to Wikipedia...")
- A generic statement about the industry ("In today's world of cloud computing...")
- A question you immediately answer ("What is Kubernetes? Kubernetes is...")
- A throat-clearing preamble ("Before we get started, let me explain...")

## Closing Patterns

**NEVER close with:**
- "In summary, [repeat everything]"
- "Key Takeaways:" followed by a bullet list
- "I hope this was helpful"
- Generic inspirational statements about technology

See voice profile for the user's preferred closing style.

## Emphasis Patterns

These are general rules. The voice profile specifies which the user favors and how heavily:
- **Italics** for vocal stress emphasis
- **Bold** for key terms on first introduction
- **Em dashes** for interjections (check voice profile — L2 bans these by default)
- **ALL CAPS** sparingly, for genuine emphasis

## Rhetorical Habits

- **Direct "I" and "you" address.** First person for experience, second person to engage the reader.
- **Quantify everything.** Don't say "it's expensive" — calculate the number. Don't say "the market grew" — say by how much.
- **Name your sources.** Don't say "studies show" — link to the specific thing or name it.
- **Opinions stated as opinions.** "I believe," "I recommend" — not hedged as "some might argue."

## Anti-Patterns Checklist

Before finalizing any piece of writing, verify:
- [ ] No L1 always-banned vocabulary words appear
- [ ] L2 anti-slop phrases checked (respecting L3 voice profile overrides)
- [ ] L2 anti-slop structures checked (respecting L3 voice profile overrides)
- [ ] Opening is a hook, not a definition or preamble
- [ ] Closing is specific and actionable, not a generic summary
- [ ] Sentence lengths vary — no monotonous rhythm
- [ ] At least one moment of personality (humor, aside, reference)
- [ ] Claims are quantified where possible
- [ ] Reader is addressed directly at least once
- [ ] No sycophantic or hedge-heavy language
- [ ] Doesn't read like a listicle unless the format demands it

## Quick Checks

Before delivering prose, scan for:

- Any L1 always-banned vocabulary? Remove.
- Any passive voice? Find the actor, make them the subject.
- Inanimate thing doing a human verb ("the decision emerges")? Name the person.
- Any throat-clearing opener from anti-slop-phrases.md? Cut to the point (unless L3 overrides).
- Three consecutive sentences match length? Break one.
- Vague declarative ("The implications are significant")? Name the specific implication.

## Scoring

Rate 1-10 on each dimension:

| Dimension | Question |
|-----------|----------|
| Voice match | Sounds like the person in voice-profile.md? |
| Directness | Statements or announcements? |
| Rhythm | Varied or metronomic? |
| Trust | Respects reader intelligence? |
| Authenticity | Sounds human, not AI-generated? |
| Density | Anything cuttable? |

Below 42/60: revise.

## Format Adaptation

The voice stays constant. The **dial** changes by format:

| Trait | Blog Post | Design Doc | Email |
|---|---|---|---|
| Personality | Full (100%) | Medium (60%) | Scales with relationship |
| Humor | Frequent | Rare, strategic | Occasional with peers |
| Formality | Low-medium | Medium-high | Context-dependent |
| Structure rigidity | Moderate | High | Low |
| Emphasis | Heavy | Moderate | Light |
| Pop culture refs | Welcome | Only if team culture allows | Only with close peers |
| Length | 1000-3000 words | 2-10 pages | 50-300 words |

See the individual command files for format-specific structural guidance.
