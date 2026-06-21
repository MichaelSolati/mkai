# Workflows Reference

Detailed step-by-step for each match-tracker operation. SKILL.md describes the logic; this file handles the shell-command specifics.

---

## Obsidian command base

All obsidian calls use:
```
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py <subcommand> [args]
```

Multi-line content always goes to `$TMPDIR/<name>.md` first, then passed via `--file`. Never inline multi-line markdown as a positional arg - backslashes, backticks, and `$` will break.

---

## 1. New match

**Goal:** Create `dating/<name-slug>/profile.md` and `dating/<name-slug>/conversation.md` with correct structure.

```bash
# Build profile.md from template + user's input, write to vault
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py write "dating/<name-slug>/profile.md" --file "$TMPDIR/profile.md"

# Build conversation.md skeleton with Pre-Match Strategy filled in
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py write "dating/<name-slug>/conversation.md" --file "$TMPDIR/conversation.md"
```

- `write` creates intermediate folders automatically (no mkdir needed).
- Use the exact section structure from `profile-template.md` and `conversation-template.md`.
- Fill `profile.md` with everything the user provided - don't leave placeholder headings empty if data was given.
- Fill Pre-Match Strategy in `conversation.md` with "what caught your eye" before writing.

**Verification:**
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read "dating/<name-slug>/profile.md" --map
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read "dating/<name-slug>/conversation.md" --map
```

---

## 2. Update profile

**Goal:** Add or replace content in a specific section of `profile.md`.

### Append within a section (most common - Notes & Observations)
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py patch "dating/<name-slug>/profile.md" \
  --target-type heading --target "Notes & Observations" \
  --operation append --file "$TMPDIR/note.md"
```

### Replace a section (facts that have changed - Quick Facts, Compatibility Signals, etc.)
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py patch "dating/<name-slug>/profile.md" \
  --target-type heading --target "Compatibility Signals" \
  --operation replace --file "$TMPDIR/signals.md"
```

> **Warning:** `patch --operation replace` replaces the full section content under that heading down to the next heading of equal/higher level. Write the full intended section content to `$TMPDIR/`, not just the new fragment.

---

## 3. Log exchange (her message)

**Goal:** Append a new `## Exchange N` block to `conversation.md`.

First, find the current last exchange number:
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read "dating/<name-slug>/conversation.md" --map
```
The `--map` output lists headings. Find the highest `## Exchange N`, increment by 1.

Build the exchange block in `$TMPDIR/exchange.md`:
```markdown
## Exchange N

**Her response:**
> [her message verbatim]

**Read:** YYYY-MM-DD
```

Append to the log:
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py append "dating/<name-slug>/conversation.md" --file "$TMPDIR/exchange.md"
```

---

## 4. Log my sent reply

**Goal:** Append the `## My Reply` line under the current exchange. Only run after user confirms "I sent it."

Build reply block in `$TMPDIR/reply.md`:
```markdown
## My Reply (YYYY-MM-DD)

[exact text that was sent]
```

Append:
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py append "dating/<name-slug>/conversation.md" --file "$TMPDIR/reply.md"
```

> `append` adds to the end of the file. Since exchanges are written sequentially, this is correct - the reply always follows the most recently appended exchange block.

---

## 5. List active matches

```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py list dating/
```

This returns folder names (one per line). For each folder, read the metadata block (the top-level heading section containing platform/matched details):
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read "dating/<name-slug>/conversation.md" --heading "<Name> - Conversation Log"
```

Or read the full file and parse the `**Platform:**`, `**Matched:**`, `**Status:**` lines from the top of the conversation log.

Render as a table:

| Name | App | Matched | Status | Last Exchange |
|------|-----|---------|--------|---------------|
| ... | ... | ... | ... | ## Exchange N date |

---

## 6. Voice refresh

Build `$TMPDIR/voice-samples.md` from user's pasted texts, preserving their style exactly. Then write to vault:

```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py write "dating/_meta/voice-samples.md" --file "$TMPDIR/voice-samples.md"
```

The `_meta/` folder is created automatically on first write. If it already exists, `write` overwrites the file.

---

## 7. Update my profile

**Goal:** Add or replace content in a specific section of `dating/_meta/my-profile.md`.

If the file doesn't exist yet, create it from `references/my-profile-template.md`:
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py write "dating/_meta/my-profile.md" --file "$TMPDIR/my-profile.md"
```

### Append within a section (most new info lands here)
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py patch "dating/_meta/my-profile.md" \
  --target-type heading --target "Notes & Observations" \
  --operation append --file "$TMPDIR/note.md"
```

### Replace a section (facts that have changed)
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py patch "dating/_meta/my-profile.md" \
  --target-type heading --target "Quick Facts" \
  --operation replace --file "$TMPDIR/facts.md"
```

> **Section routing guide:**
> - Concrete facts (age, job, location) → `Quick Facts`
> - Who-I-am statements, humor, energy → `Identity & Personality`
> - Activities, obsessions → `Interests & Hobbies`
> - Typical week, life stage → `Lifestyle & Context`
> - Relationship goals → `What I'm Looking For`
> - Hard nos, patterns to avoid → `Dealbreakers & Friction`
> - Go-to spots, date ideas → `Date Repertoire`
> - Texting style notes → `Conversation Style Notes`
> - References, phrases, humor patterns → `Voice Anchors`
> - Everything else → `Notes`

---

## 8. View my profile

```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read "dating/_meta/my-profile.md"
```

If absent, note to user: "No dossier yet. Say 'update my profile' to start one."

---

## Reading voice context

```bash
# dating-specific texting samples (required — created by voice refresh)
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read "dating/_meta/voice-samples.md"

# User dossier (optional — created by Update my profile)
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read "dating/_meta/my-profile.md"
```

If `voice-samples.md` is absent → run voice refresh flow before crafting (required).
If `my-profile.md` is absent → proceed without, note "say 'update my profile' to start one."

The `my-voice` skill is already in context via the `writing` profile — no manual file loading needed.

---

## Invoking message-crafter

Use the Skill tool with `skill: "message-crafter"` and pass the full assembled context as `args`. Structure the args as:

```
[CONTEXT]
Platform: Hinge
Conversation stage: early-game
User wants: reply to her latest message
Voice calibration: pre-loaded - skip Phase 1 and proceed directly to situation assessment.

[ABOUT ME]
<full contents of dating/_meta/my-profile.md, or "Not available - user can build one via 'update my profile'">

[HER PROFILE]
<full contents of dating/<name-slug>/profile.md>

[CONVERSATION LOG]
<full contents of dating/<name-slug>/conversation.md>

[VOICE: texting samples]
<contents of dating/_meta/voice-samples.md>
```

message-crafter will interpret the context block, skip voice calibration (samples already provided), assess the situation, and return 2–3 options with reasoning. The `my-voice` skill context is already loaded — no additional voice blocks needed. Present options verbatim - do not summarize or filter.

---

## 9. Disambiguate on collision (rename sequence)

When a name collision is detected (see SKILL.md "Name Collisions"), rename the existing folder before creating the new match. There is no native `obsidian rename` command - use read → write → delete.

**Step 1 - Capture the existing match's files:**
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read "dating/<old-name-slug>/profile.md" > "$TMPDIR/profile_rename.md"
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read "dating/<old-name-slug>/conversation.md" > "$TMPDIR/conversation_rename.md"
```

**Step 2 - Write to the new disambiguated path:**
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py write "dating/<new-name-slug>/profile.md" --file "$TMPDIR/profile_rename.md"
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py write "dating/<new-name-slug>/conversation.md" --file "$TMPDIR/conversation_rename.md"
```

**Step 3 - Verify the new files exist before deleting the originals:**
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read "dating/<new-name-slug>/profile.md" --map
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read "dating/<new-name-slug>/conversation.md" --map
```

Only proceed to Step 4 if both reads succeed.

**Step 4 - Delete the old files:**
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py delete "dating/<old-name-slug>/profile.md"
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py delete "dating/<old-name-slug>/conversation.md"
```

**Step 5 - Update `Display name:` and `Disambiguator type:` in the renamed profile:**
```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py patch "dating/<new-name-slug>/profile.md" \
  --target-type heading --target "Quick Facts" \
  --operation replace --file "$TMPDIR/quick_facts_rename.md"
```

Write the full updated Quick Facts block to `$TMPDIR/quick_facts_rename.md` first.

---

### Lookup - list candidates matching a first name

When the user references a name and multiple folders start with that first name:

```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py list dating/
```

Filter the result to folders matching the normalized/slugified `<First>` (case-insensitive). For each candidate, read the conversation header (top-level heading section containing platform/matched details) to extract context:

```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read "dating/<candidate-slug>/conversation.md" --heading "<Candidate> - Conversation Log"
```

Parse `**Platform:**`, `**Matched:**`, `**Status:**`, and the highest `## Exchange N` heading for a "last exchange" date. Surface to the user as a one-liner per candidate before asking which they mean.
