---
description: Analyze your writing samples and generate a personal voice profile in your Obsidian vault
argument-hint: <optional: paths to writing samples>
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - Write
  - Edit
  - Agent
---

# /voice-setup — Generate Your Voice Profile

This command analyzes samples of your writing and creates a personalized voice profile stored in your Obsidian vault at `identity/writing-voice.md`. This file powers `/write`, `/email`, `/design-doc`, and `/blog`.

## Step 1: Check for Existing Profile

Run:

```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read identity/writing-voice.md
```

- **If the file exists:** Tell the user: "You already have a voice profile. Running this will overwrite it. Do you want to continue?" Wait for confirmation before proceeding.
- **If the command fails or returns not-found:** Continue to Step 2.

Also check if old local files exist and offer migration:

```bash
[ -f ~/.mkai/profiles/writing/~/.mkai/profiles/writing/skills/my-voice/references/voice-profile.md ] && echo "local-exists"
```

If local files exist and no vault profile exists, offer: "I found an existing local voice profile at `~/.mkai/profiles/writing/~/.mkai/profiles/writing/skills/my-voice/references/voice-profile.md`. Want me to migrate it to the vault instead of starting from scratch?"

If the user says yes, run the migration (Step 3b) and skip to Step 7.

## Step 2: Collect Writing Samples

If `$ARGUMENTS` contains file paths, read those files directly and skip the prompt.

Otherwise, ask the user:

> I'll analyze your writing to create a personal voice profile. I need 3-5 samples of your writing — blog posts, emails, docs, README files, anything you've written. The more variety in format and audience, the better the profile.
>
> How would you like to provide them?
>
> 1. **File paths** — give me paths and I'll read them
> 2. **Paste** — paste your writing directly
> 3. **Mix** — combine both
>
> When you're done providing samples, say "that's all."

**Guidelines for sample collection:**

- Minimum 3 samples for a usable profile. If fewer than 3, warn: "With fewer than 3 samples, the profile may not capture your full range. Consider adding more later by running `/voice-refresh`."
- If all samples are the same format (e.g., all blog posts), note: "These are all the same format. Adding an email or doc would help capture how your voice adapts across contexts."
- If a sample is code, config, or other non-prose: skip it and explain: "Skipping [filename] — it's not prose. I need writing samples like blog posts, emails, or docs."

## Step 3: Read All Samples

Use the `Read` tool to load each sample into context. For pasted text, work with it directly.

## Step 3b: Migration Path (if migrating existing local profile)

If the user chose to migrate:

```bash
# Read the existing local files
cat ~/.mkai/profiles/writing/~/.mkai/profiles/writing/skills/my-voice/references/voice-profile.md
cat ~/.mkai/profiles/writing/~/.mkai/profiles/writing/skills/my-voice/references/sample-excerpts.md 2>/dev/null
```

Combine them into the new combined format (see Step 6 for the structure) and jump to Step 6 to write to vault.

## Step 4: Analyze Voice Patterns

Read `~/.mkai/profiles/writing/skills/my-voice/references/anti-slop-phrases.md` and `~/.mkai/profiles/writing/skills/my-voice/references/anti-slop-structures.md` to understand the L2 baseline you'll be comparing against.

Analyze across **all samples simultaneously**, looking for patterns that recur in 2+ samples. For each dimension below, cite specific evidence from the samples.

### 4a. Core Identity

- Who is this person? What's their default relationship to the reader?
- What's their overall register? (casual, professional, academic, conversational)
- What's their stance? (authoritative, collaborative, exploratory, opinionated)
- How do they establish credibility? (experience, data, logic, empathy)

### 4b. Vocabulary Fingerprints

- Words and phrases that appear in multiple samples — these are signature expressions
- Catchphrases, pet phrases, distinctive turns of phrase
- Technical jargon they favor or avoid
- Characteristic modifiers or intensifiers
- NOT common words — only expressions that are distinctively *theirs*

### 4c. Opening Patterns

- How do they start pieces? Categorize each opening by type:
  - Personal anecdote
  - Strong declarative / opinion
  - Relatable pain point
  - Question / provocation
  - Scene-setting
  - Other (name the pattern)
- Extract 2-3 representative opening examples verbatim

### 4d. Closing Patterns

- How do they end pieces?
- Do they use a specific heading for conclusions?
- Do they include calls-to-action? What kind?
- Do they use callbacks to the opening?
- Extract 1-2 representative closing examples verbatim

### 4e. Humor Style

- Type: self-deprecating, dry, absurdist, punny, sarcastic, none
- Frequency: frequent, occasional, rare, never
- Delivery: parenthetical asides, footnotes, inline, standalone
- References: pop culture, industry, personal experience, other
- If no humor detected, note that explicitly

### 4f. Emphasis Patterns

- Which tools do they reach for? Rank by frequency:
  - Italics
  - Bold
  - ALL CAPS
  - Em dashes
  - Parenthetical asides
  - Exclamation points
  - Ellipses
- Include specific examples from the samples

### 4g. Rhetorical Habits

- Do they quantify claims?
- Do they cite sources by name?
- Do they use rhetorical questions?
- Do they address the reader directly?
- Do they use first person ("I") or collective ("we")?
- Do they state opinions explicitly or hedge?

### 4h. Sentence Rhythm

- Do they use fragments?
- What's the typical mix of short vs. long sentences?
- Do they vary paragraph length?
- Do they use one-word or one-phrase paragraphs for emphasis?

### 4i. Anti-Slop Override Detection (L2 → L3)

**This is critical.** Cross-reference the user's writing against the L2 anti-slop rules:

For each pattern in `anti-slop-phrases.md` and `anti-slop-structures.md`, check if the user's authentic writing uses it. If a "banned" pattern appears naturally in 2+ samples, it's an authentic part of this person's voice and should be an L3 override.

Common overrides to look for:

- Em dashes (banned by L2, used by many writers)
- Specific adverbs that are part of the user's natural speech ("honestly", "actually", "just")
- Dramatic fragmentation (short punchy fragments)
- Rhetorical questions
- Specific throat-clearing phrases that are part of the user's voice ("Here's the thing:", "Look,", "But here's the deal:")
- Three-item lists
- Binary contrasts used deliberately

For each override found, note:

- The specific L2 rule being overridden
- Evidence: the exact quotes from samples where the user uses this pattern
- Assessment: is this a genuine stylistic choice or an AI-ism that slipped in?

## Step 5: Draft the Combined File Content

Prepare the following combined markdown in memory (do NOT write local files — write directly to vault in Step 6):

```markdown
---
type: reference
tags: [identity, voice, writing]
status: active
---

# Writing Voice

## Voice Profile

### Core Identity

[2-3 paragraphs describing who the user is as a writer, their default tone, their relationship to the reader, how they establish credibility]

### Vocabulary Fingerprints

#### Words and Phrases You Actually Use
- [list of 10-20 signature expressions, each with a brief note on context]

### Opening Patterns

[Description of how the user typically opens, with categorized examples]

#### Examples
[2-3 verbatim opening excerpts from the samples]

### Closing Patterns

[Description of how the user typically closes]

#### Examples
[1-2 verbatim closing excerpts from the samples]

### Humor Style

**Type:** [type]
**Frequency:** [frequency]
**Delivery:** [delivery method]

[Description with examples from the samples]

### Emphasis Patterns

[Ranked list of emphasis tools with examples]

### Rhetorical Habits

[Description of rhetorical tendencies with examples]

### Sentence Rhythm

[Description of rhythm patterns with examples]

### Anti-Slop Overrides

The following L2 patterns are authentic parts of this voice. **Allow these when writing in this voice.**

#### [Override Category, e.g., "Em Dashes"]
**Rule overridden:** [which L2 anti-slop rule]
**Evidence:** [verbatim quotes from samples]
**Usage:** [how this person uses the pattern]

[Repeat for each override]

## Sample Excerpts

Real excerpts from your published writing. Used as few-shot examples of your authentic voice.

---

### [Category — e.g., "Opening Hook", "Technical Explanation", "Humor", "Closing"]

*From "[source title or description]"*

> [verbatim excerpt, 2-5 sentences]

---

[Repeat for 4-6 excerpts]
```

## Step 6: Write to Vault

Write the combined file to the vault:

```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py write identity/writing-voice.md "[CONTENT]"
```

(Pass content via shell variable or temp file to handle special characters safely.)

Then set metadata:

```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py meta identity/writing-voice.md \
  --set type=reference --set status=active
```

## Step 7: Summary

Print a summary for the user:

```markdown
## Voice Profile Generated

**Identity:** [1-sentence summary]
**Signature phrases:** [top 5]
**Humor style:** [type, frequency]
**Emphasis tools:** [top 3]
**L2 anti-slop overrides:** [count] patterns whitelisted

Written to: `identity/writing-voice.md` in your Obsidian vault

Try it out:
- /write <anything>
- /email <recipient - purpose>
- /design-doc <feature>
- /blog <topic>

To update your profile incrementally with new samples: /voice-refresh
```
