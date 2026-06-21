# Anecdotes Schema

Structure and conventions for `dating/_meta/anecdotes.md` — the user's story bank.

---

## Why a separate file?

Stories and anecdotes need per-entry metadata that a plain section in `my-profile.md` can't provide:
- **Tags** for topic-based retrieval ("use a music story in this conversation")
- **Used-with tracking** to avoid retelling the same story to the same person
- **Hook guidance** so the agent knows *when* to deploy each story

A section in `my-profile.md` would be a wall of text. A separate structured file keeps the dossier readable and makes anecdotes queryable.

---

## File structure

```markdown
---
type: anecdote-collection
updated: YYYY-MM-DD
---

# Anecdotes & Stories

### a-2026-001
**Title:** Mistaken for the band at a small show in Chicago
**Tags:** music, embarrassing, travel
**Length:** medium
**Hook works for:** music conversations, travel banter, self-deprecating openers
**Last used:** 2026-05-12
**Used with:** sarah-k, nina

One paragraph summary — enough for the agent to drop a one-liner reference into a message.
The full story lives in your head; this is the bones.

---

### a-2026-002
**Title:** ...
```

---

## Field reference

| Field | Purpose |
|---|---|
| `### a-YYYY-NNN` | Unique ID. Year-scoped, monotonic. Helper auto-assigns. |
| `**Title:**` | Short title. How you'd reference the story: "the Chicago show thing." |
| `**Tags:**` | Comma-separated topic tags. Used for `list-anecdotes --tags`. |
| `**Length:**` | `short` / `medium` / `long` — signals how much space it needs in conversation. |
| `**Hook works for:**` | Free text. What conversation contexts or topics this fits. Guides `assemble-context`. |
| `**Last used:**` | ISO date or empty. Updated by `mark-anecdote-used`. |
| `**Used with:**` | Comma-separated match slugs. Updated by `mark-anecdote-used`. |
| Summary paragraph | 2–4 sentences. The agent reads this to drop a reference naturally. |

---

## ID convention

Format: `a-YYYY-NNN` — year of entry, zero-padded ordinal (001, 002, ...).

- IDs are assigned by the helper and never changed.
- If the year rolls over, the NNN counter resets to 001 for the new year.
- Two entries from different years can coexist: `a-2025-007` and `a-2026-001`.

---

## How the agent uses anecdotes

1. **`assemble-context <slug>`** — automatically includes the 5 anecdotes with the best tag coverage that haven't been used with this match yet. Passes them in the `[ANECDOTES]` block to `message-crafter`.
2. **`list-anecdotes --unused-with <slug>`** — returns all stories not yet told to this person.
3. **`list-anecdotes --tags music,travel`** — returns stories matching those tags.
4. After a story is used in a message that gets sent: **`mark-anecdote-used <id> --with <slug>`**.

---

## Adding an anecdote

```bash
# Write summary to a temp file first
cat > $TMPDIR/anecdote.md << 'EOF'
We were at the bottom of the bill at a tiny venue in Logan Square. At the end of the set,
someone handed me a beer and said "great set man" — I hadn't played. Spent the next hour
deflecting compliments for a band I had nothing to do with.
EOF

python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py capture anecdote \
  --title "Mistaken for the band in Chicago" \
  --tags "music,embarrassing,travel" \
  --length medium \
  --hook "music conversations, self-deprecating openers" \
  --file "$TMPDIR/anecdote.md"
```

Or just say: **"save this story / I always tell this anecdote about…"** — the agent will run `capture anecdote` and confirm before writing.

---

## Editing and maintaining

- **Never hand-edit block IDs** — the helper uses them as stable keys.
- You can edit `**Title:**`, tags, hook, and the summary body freely.
- If a block becomes unparseable (misformatted bold-key lines), the helper emits a `warning` and skips it rather than crashing.
- Run `list-anecdotes` to audit what's in the file.
