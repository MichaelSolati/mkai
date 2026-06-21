---
description: Incrementally update your voice profile with new writing samples
argument-hint: <optional: paths to new writing samples>
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - Write
  - Edit
  - Agent
---

# /voice-refresh — Update Your Voice Profile

This command incrementally updates your existing voice profile in `identity/writing-voice.md` with new writing samples. It diffs the new samples against the current profile, shows you what would change, and on confirmation patches the vault file in place without touching sections that don't need updating.

Use this when you've written something new and want the profile to reflect it — no need to start from scratch.

## Step 1: Load the Existing Profile

```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read identity/writing-voice.md
```

If the file is not found, tell the user:

> No voice profile found. Run `/voice-setup` first to create your initial profile.

Stop here.

## Step 2: Collect New Writing Samples

If `$ARGUMENTS` contains file paths, read those files directly and skip the prompt.

Otherwise, ask the user:

> I'll compare these new samples against your existing profile. Paste 1–3 pieces of your recent writing, or give me file paths.
>
> When done, say "that's all."

Guidelines:
- At least 1 sample required. 1–3 is ideal.
- Skip samples that are code, config, or non-prose — explain why.
- If the user provides samples from the same format as before, that's fine — still useful for catching new phrases.

## Step 3: Read All New Samples

Use the `Read` tool to load each sample into context.

## Step 4: Analyze New Samples Against Existing Profile

Also load the L2 anti-slop rules for reference:
- `~/.mkai/profiles/writing/skills/my-voice/references/anti-slop-phrases.md`
- `~/.mkai/profiles/writing/skills/my-voice/references/anti-slop-structures.md`

Run the same analysis as `/voice-setup` but focus on **what's new or different** compared to the existing profile. Specifically look for:

**New vocabulary fingerprints:**
- Phrases in 2+ new samples that don't appear in the existing `### Vocabulary Fingerprints` section

**New anti-slop overrides:**
- L2-banned patterns appearing authentically in new samples that aren't already in `### Anti-Slop Overrides`

**New sample excerpts:**
- 1–3 representative excerpts from the new samples that illustrate a voice dimension not yet captured (or captured less well than the new sample does)

**Contradictions with existing profile:**
- If a new sample contradicts something in the existing profile (e.g., the profile says "no em dashes" but the new sample uses them deliberately), note this explicitly and ask the user to confirm before updating.

## Step 5: Show Preview and Confirm

Present the proposed changes clearly:

```markdown
## Proposed Updates to Your Voice Profile

### New Vocabulary Fingerprints
- "phrase one" — context description
- "phrase two" — context description

### New Anti-Slop Overrides
- **[Pattern]** — appears in [sample name]: "[quote]"

### New Sample Excerpts to Add
**[Category]**
*From "[sample description]"*
> [excerpt]

### Contradictions Found (needs your input)
- [any conflicts between new samples and existing profile]
```

Ask: "Should I apply these changes? (yes / skip / let me edit)"

If the user says "let me edit," show them the full proposed additions as markdown they can copy-paste and modify. Wait for their edited version before applying.

## Step 6: Apply Changes

On confirmation, patch the vault file section by section. Use `--operation append` to add to existing sections without replacing them:

**New vocabulary fingerprints:**
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py patch identity/writing-voice.md \
  "[new phrases as bullet list]" \
  --target-type heading --target "Words and Phrases You Actually Use" \
  --operation append
```

**New anti-slop overrides:**
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py patch identity/writing-voice.md \
  "[new override block]" \
  --target-type heading --target "Anti-Slop Overrides" \
  --operation append
```

**New sample excerpts:**
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py patch identity/writing-voice.md \
  "[new excerpt block]" \
  --target-type heading --target "Sample Excerpts" \
  --operation append
```

For contradictions that the user confirmed should update the profile, use `--operation replace` on the specific heading.

## Step 7: Log the Refresh

Append a dated entry to the refresh log:

```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py append identity/writing-voice-log.md \
  "## [YYYY-MM-DD] Voice Refresh\n\n**Samples:** [number] ([brief description])\n**Added:** [N] new vocab phrases, [N] new overrides, [N] new excerpts\n**Notes:** [anything notable about what changed or was confirmed]\n"
```

If `identity/writing-voice-log.md` doesn't exist, the append command will create it.

## Step 8: Summary

```markdown
## Voice Profile Updated

**Added:** [N] vocabulary phrases, [N] anti-slop overrides, [N] sample excerpts
**Updated:** [any sections that were replaced, not just appended]
**Logged:** identity/writing-voice-log.md

Nothing was removed — your existing profile entries are preserved.
```
