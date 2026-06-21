# Workflows Reference

Detailed step-by-step call sequences for each match-tracker operation. All operations go through the helper script — never call obsidian.py directly.

---

## Helper base

```bash
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py <command> [args]
```

All commands return JSON: `{"ok": true|false, "command": "...", "data": {...}, "warnings": [...], "errors": [...]}`

**Multi-line content:** always write to `$TMPDIR/<name>.md` first, then pass via `--file`. Never inline multi-line markdown.

**Dry run:** add `--dry-run` to any command to see what obsidian.py calls would be made without touching the vault.

---

## 1. New match

```bash
# Build profile content from template + user input
cat > $TMPDIR/profile.md << 'EOF'
# Sarah

## Quick Facts
- **Age:** 28
...
EOF

python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py new-match \
  --name "Sarah" \
  --platform "Hinge" \
  --matched "2026-06-20" \
  --what-caught-eye "her answer about the road trip" \
  --profile-file "$TMPDIR/profile.md"
```

Returns: `{slug, name, profile_path, conversation_path, collisions_resolved}`

On `COLLISION` error: run `disambiguate <old-slug> --to <new-slug>` first, then retry.

---

## 2. Update match profile

```bash
# Append to a section (most common)
cat > $TMPDIR/note.md << 'EOF'
- Works in publishing; moves start next month to Williamsburg.
EOF

python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py update-match sarah \
  --section "Notes & Observations" \
  --file "$TMPDIR/note.md" \
  --operation append

# Replace a section (facts that changed)
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py update-match sarah \
  --section "Quick Facts" \
  --file "$TMPDIR/facts.md" \
  --operation replace
```

> **`--operation replace`** replaces the full section. Write the complete intended content to `$TMPDIR/`, not just the new fragment.

---

## 3. Log exchange (her message)

```bash
# Write her message to a temp file
cat > $TMPDIR/exchange.md << 'EOF'
haha okay but what does that even mean for you day-to-day
EOF

python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py log-exchange sarah \
  --her-file "$TMPDIR/exchange.md" \
  --read "2026-06-21"
```

Returns: `{slug, exchange_n, conversation_path}`

---

## 4. Log my sent reply

Only after user confirms "I sent it."

```bash
cat > $TMPDIR/reply.md << 'EOF'
means I get to make up the rules lol
EOF

python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py log-reply sarah \
  --my-file "$TMPDIR/reply.md" \
  --sent "2026-06-21"
```

---

## 5. List active matches

```bash
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py list-matches --status active
```

Returns: `{matches: [{slug, platform, matched_date, status, last_exchange_n, last_exchange_date, next_event}]}`

---

## 6. Voice refresh

```bash
# User pastes 5-10 recent texts → write to temp file
cat > $TMPDIR/voice-samples.md << 'EOF'
[pasted texts here]
EOF

python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py voice-refresh \
  --samples-file "$TMPDIR/voice-samples.md"
```

---

## 7. Update my profile

Section routing guide:

| Signal type | Target section |
|---|---|
| Concrete fact (job, location, age) | `Quick Facts` |
| Who-I-am statements, humor, energy | `Identity & Personality` |
| Activities, obsessions, current interests | `Interests & Hobbies` |
| Typical week, life stage, social rhythm | `Lifestyle & Context` |
| Relationship goals, pace | `What I'm Looking For` |
| Hard nos, patterns to avoid | `Dealbreakers & Friction` |
| Go-to spots, date ideas | `Date Repertoire` |
| Texting style notes | `Conversation Style Notes` |
| Recurring phrases, humor patterns | `Voice Anchors` |
| Specific things I enjoy (finer-grained) | `Likes` |
| Specific soft turn-offs (not dealbreakers) | `Dislikes` |
| Soft patterns about how I prefer things | `Preferences` |
| Stories worth retelling | Use `capture anecdote` → `anecdotes.md` |
| Everything else | `Notes` |

```bash
cat > $TMPDIR/note.md << 'EOF'
- specialty coffee, late-night diners
EOF

python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py update-my-profile \
  --section "Likes" \
  --file "$TMPDIR/note.md" \
  --operation append
```

---

## 8. View my profile

```bash
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py view-my-profile

# Or a single section:
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py view-my-profile \
  --section "Likes"
```

---

## 9. Craft reply — full sequence

```bash
# Step 1: check upcoming calendar before suggesting date times
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py list-events --upcoming

# Step 2: assemble full context for message-crafter
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py assemble-context sarah \
  --stage "early-game" \
  --purpose "reply to her message about travel"
```

Returns: `{context_block, slug, stage, includes_my_profile, includes_voice_samples, anecdote_count}`

Pass `data.context_block` verbatim as `args` to the `message-crafter` Skill.

After sending:
```bash
# Log the reply
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py log-reply sarah \
  --my-file "$TMPDIR/reply.md" --sent "2026-06-21"

# If an anecdote was deployed:
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py mark-anecdote-used a-2026-001 \
  --with sarah --date "2026-06-21"
```

---

## 10. Capture likes / dislikes / preferences / anecdotes

```bash
# Like
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py capture like \
  --content "specialty coffee, bouldering, late-night diners"

# Dislike
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py capture dislike \
  --content "brunch as a personality, places with TVs everywhere"

# Preference
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py capture preference \
  --content "evening dates over daytime"

# Anecdote (write summary to file first)
cat > $TMPDIR/story.md << 'EOF'
At a small show in Logan Square, a stranger handed me a beer and said "great set man."
I hadn't played. Spent the next 45 minutes deflecting compliments for a band I had nothing to do with.
EOF

python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py capture anecdote \
  --title "Mistaken for the band in Chicago" \
  --tags "music,embarrassing,travel" \
  --length medium \
  --hook "music conversations, self-deprecating openers" \
  --file "$TMPDIR/story.md"
```

Returns `anecdote_id` which can be used with `mark-anecdote-used`.

---

## 11. List anecdotes

```bash
# All anecdotes
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py list-anecdotes

# Unused with a specific match
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py list-anecdotes \
  --unused-with sarah

# Filter by tags
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py list-anecdotes \
  --tags "music,travel"
```

---

## 12. Schedule a date

```bash
# Step 1: check for conflicts first
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py check-conflict \
  --date 2026-06-28 --start 19:00 --buffer-minutes 30

# Step 2: schedule (re-run with --force if conflicts found and user confirmed)
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py schedule sarah \
  --date 2026-06-28 \
  --start 19:00 \
  --end 21:00 \
  --where "Maison Premiere, Williamsburg" \
  --activity drinks
```

Returns: `{event_id, path, date, start, where, activity, match, conflicts}`

On conflict without `--force`: returns `{event_id: null, conflicts: [...], message: "..."}`. Surface the conflict to the user and ask how to proceed, then re-call with `--force` if they confirm.

---

## 13. List upcoming events

```bash
# All upcoming
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py list-events --upcoming

# This week
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py list-events \
  --from 2026-06-23 --to 2026-06-30

# With a specific match
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py list-events \
  --with sarah
```

---

## 14. Check conflict

```bash
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py check-conflict \
  --date 2026-06-28 \
  --start 19:00 \
  --end 21:00 \
  --buffer-minutes 30
```

Returns: `{has_conflict, conflict_count, same_day, time_overlaps, date}`

---

## 15. Update or cancel event

```bash
# Reschedule
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py update-event \
  2026-06-28-sarah-drinks \
  --date 2026-07-02 \
  --start 20:00 \
  --status rescheduled

# Cancel
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py cancel-event \
  2026-06-28-sarah-drinks \
  --reason "she had a conflict"
```

---

## 16. Complete event (log date outcome)

```bash
cat > $TMPDIR/outcome.md << 'EOF'
Really good. Two hours felt like twenty minutes. She knows everyone in that bar.
Asked if I wanted to walk after — good sign.
EOF

cat > $TMPDIR/reflection.md << 'EOF'
Conversation stayed light but I could tell she was gauging me. Don't overthink it.
EOF

python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py complete-event \
  2026-06-22-sarah-k-drinks \
  --outcome-file "$TMPDIR/outcome.md" \
  --reflection-file "$TMPDIR/reflection.md"
```

---

## 17. Disambiguate on name collision

When a name collision is detected at new-match intake:

```bash
# Rename the existing match folder (also rewrites all calendar events)
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py disambiguate sarah \
  --to sarah-k
```

Then patch Quick Facts on both profiles to record `Display name:` and `Disambiguator type:`:

```bash
cat > $TMPDIR/facts.md << 'EOF'
- **Display name:** Sarah K
- **Disambiguator type:** last-initial
...
EOF

python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py update-match sarah-k \
  --section "Quick Facts" \
  --file "$TMPDIR/facts.md" \
  --operation replace
```

---

## Match summary (read current state)

```bash
# Profile + metadata + events
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py match-summary sarah

# Include conversation log
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py match-summary sarah \
  --include-conversation
```

Returns: `{slug, meta, profile, conversation, next_event, upcoming_events, past_events}`
