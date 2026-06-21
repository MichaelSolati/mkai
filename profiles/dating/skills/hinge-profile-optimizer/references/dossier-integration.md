# Dossier Integration

How `hinge-profile-optimizer` reads from and writes to the user dossier at `dating/_meta/my-profile.md`.

---

## Read Contract (Phase 0.5)

Load the full dossier silently before Phase 2. Use it to:
- Pre-fill discovery answers already known
- Skip or shorten question areas already covered
- Ask confirmation/extension questions instead of fresh ones

---

## Section Mapping

| Discovery area (Phase 2) | Dossier section(s) |
|---|---|
| Work & Status | `## Quick Facts` (job/industry), `## Lifestyle & Context` (work-life rhythm) |
| Personality & Opinions | `## Identity & Personality`, `## Voice Anchors` (strong opinions, humor) |
| Social & Warmth | `## Identity & Personality` (relationship to others, warmth markers) |
| Lifestyle & Context | `## Lifestyle & Context`, `## Interests & Hobbies` |
| Things they enjoy day-to-day (granular) | `## Likes` |
| Pet peeves, soft turn-offs (not dealbreakers) | `## Dislikes` |
| Scheduling / social patterns ("I prefer...") | `## Preferences` |
| Dating Specifics - what I'm looking for | `## What I'm Looking For` |
| Dating Specifics - past patterns | `## Dealbreakers & Friction` |
| Dating Specifics - great first date | `## Date Repertoire` |
| Phase 3 Reality Check - dealbreakers | `## Dealbreakers & Friction` |
| Phase 3 Reality Check - target market | `## What I'm Looking For` |

---

## Write Contract (Phase 5.5)

After copy is delivered, offer to persist findings. Write only identity-stable facts — not profile copy, not prompt text.

### What to persist

| Type | Where in dossier |
|---|---|
| Job, location, age, education, height | `## Quick Facts` — replace if stale, append if new |
| How they describe themselves, humor register | `## Identity & Personality` — append |
| Activities, obsessions, current interests | `## Interests & Hobbies` — append |
| Day-to-day things they enjoy (granular) | `## Likes` — append |
| Soft pet peeves surfaced in Discovery | `## Dislikes` — append |
| Soft patterns about how they prefer things | `## Preferences` — append |
| Week shape, social rhythm, life stage | `## Lifestyle & Context` — append |
| What they want in a relationship | `## What I'm Looking For` — append or replace |
| Hard dealbreakers surfaced in Phase 3 | `## Dealbreakers & Friction` — append |
| Go-to spots, date ideas that emerged | `## Date Repertoire` — append |
| Recurring phrases, humor patterns mined in Discovery | `## Voice Anchors` — append |
| Anything else that doesn't fit neatly | `## Notes` — append |

### What NOT to persist

- The profile copy itself (prompts, captions) — that belongs in a Hinge profile doc, not the dossier
- Photo evaluations or ordering notes
- Settings or algorithm strategy
- Anything speculative ("she seemed to be X" — this is *the user's* dossier, not a match's)

### Anecdotes — match-tracker only

**Do not write to `dating/_meta/anecdotes.md` from hinge-profile-optimizer.** Anecdotes have a structured per-block schema (ID, tags, last-used, used-with) managed exclusively by match-tracker's `capture anecdote` flow. If Discovery surfaces a story-worthy anecdote, note it conversationally and suggest: "Want me to save that story to your anecdote bank? Just say 'save this anecdote' in match-tracker."

---

## Shell Commands

### Preferred — match-tracker helper

```bash
# Read dossier (Phase 0.5 — silent pre-flight)
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py view-my-profile

# Check specific section
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py view-my-profile \
  --section "Quick Facts"

# Append to a section (most Phase 5.5 writes)
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py update-my-profile \
  --section "<Section Name>" \
  --operation append \
  --file "$TMPDIR/content.md"

# Replace a section (stale facts only)
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py update-my-profile \
  --section "Quick Facts" \
  --operation replace \
  --file "$TMPDIR/facts.md"

# Create dossier from template if it doesn't exist (handled automatically by update-my-profile)
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py update-my-profile \
  --section "Quick Facts" \
  --content ""
```

### Fallback — direct obsidian.py (if match-tracker helper is unavailable)

```bash
# Read dossier
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read "dating/_meta/my-profile.md"

# Check sections present
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read "dating/_meta/my-profile.md" --map

# Append to a section
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py patch "dating/_meta/my-profile.md" \
  --target-type heading --target "<Section Name>" \
  --operation append --file "$TMPDIR/content.md"

# Replace a section (stale facts only)
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py patch "dating/_meta/my-profile.md" \
  --target-type heading --target "Quick Facts" \
  --operation replace --file "$TMPDIR/facts.md"

# Create dossier from template if it doesn't exist
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py write "dating/_meta/my-profile.md" \
  --file "$TMPDIR/my-profile.md"
```
