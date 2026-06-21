# Calendar Strategy

How match-tracker stores, queries, and manages scheduled dates in Obsidian.

---

## Storage layout

Each date is its own file inside `dating/_calendar/`. The folder name prefix `_calendar` mirrors `_meta` and is explicitly excluded from match-name lookups.

```
dating/_calendar/
  2026-06-22-sarah-k-drinks.md
  2026-06-25-nina-coffee.md
  2026-07-02-sarah-k-dinner.md
```

**Filename convention:** `YYYY-MM-DD-<match-slug>[-<activity>].md`
- Always lowercase (obsidian.py slugs all writes).
- Date prefix enables lexicographic sorting by `obsidian list dating/_calendar/`.
- Activity suffix disambiguates two events on the same day with the same match.
- If filename would collide, helper appends `-2`, `-3`, etc.

---

## Frontmatter schema

```yaml
---
type: dating-event
date: 2026-06-22                         # required, ISO YYYY-MM-DD
start: "19:00"                            # optional, HH:MM 24h
end: "21:00"                              # optional
tz: America/New_York                      # IANA TZ; populated from system TZ if omitted
match: sarah-k                            # match folder slug (canonical reference)
with: "[[dating/sarah-k/profile]]"        # wikilink → graph backlinks + backlinks pane
where: "Maison Premiere, Williamsburg"    # human-readable venue
activity: drinks                          # coffee | drinks | dinner | walk | event | other
status: scheduled                         # scheduled | confirmed | completed | cancelled | rescheduled | no-show
created: 2026-06-20
updated: 2026-06-20
---
```

**Why frontmatter?** Dataview DQL queries against `dating/_calendar` can filter, sort, and group by any of these fields without markdown parsing. The helper also reads them via `obsidian read --frontmatter` for conflict detection.

**Why not `obsidian.py init`?** `init` silently drops most fields. Events are created via `obsidian write` with the full YAML block built by the helper.

---

## Event body structure

```markdown
# <Display Name> — <Activity> at <Where>

## Plan
[Reservation details, what to wear, topics to avoid, etc.]

## Outcome
[Filled in after the date via complete-event]

## Reflection
[Private post-date notes]
```

---

## Conflict detection

The helper (`match_tracker.py`) handles conflict detection in Python after fetching event frontmatter — no Obsidian plugin required.

**Same-day conflict:** any event where `date == target_date` and `status ∈ {scheduled, confirmed}`.

**Time-overlap conflict:** when both events have a `start`, check `a.start < b.end AND b.start < a.end`. Default window is 2 hours when `end` is absent.

**Buffer:** optional `--buffer-minutes N` expands each event's window by N minutes on each side (for travel time).

**User flow on conflict:**
1. Call `schedule <slug> --date ...`
2. If conflicts exist, helper returns them in `conflicts` field and does NOT create the event.
3. Agent surfaces the conflict to the user: "You already have drinks with Nina at 19:00 that night. Still schedule this?"
4. User confirms → re-call `schedule` with `--force`.

---

## Date History in match profiles

When an event is scheduled, completed, or cancelled, the helper automatically maintains a `## Date History` section in `dating/<slug>/profile.md`:

```markdown
## Date History

- [[dating/_calendar/2026-06-22-sarah-k-drinks]] — drinks, scheduled
- [[dating/_calendar/2026-07-02-sarah-k-dinner]] — dinner, completed
```

This wikilink appears in Obsidian's backlinks pane on the calendar event note, creating a bidirectional graph edge between the event and the match's profile.

---

## Common queries (via helper)

```bash
# Upcoming events (today and forward)
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py list-events --upcoming

# Events this week
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py list-events \
  --from 2026-06-23 --to 2026-06-30

# All events with a specific match
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py list-events \
  --with sarah-k

# Conflict check before suggesting a date
python3 ~/.mkai/profiles/dating/skills/match-tracker/scripts/match_tracker.py check-conflict \
  --date 2026-06-28 --start 19:00 --buffer-minutes 30
```

---

## Index awareness

`dating/_calendar` is nested under `dating/`, which is one of the four crawled "spheres" in obsidian.py's `index-update`. Events appear in `_meta/index.md` under the `dating/` section.

---

## Environment override

Set `MATCH_TRACKER_BASE=dating-test` to redirect all vault paths to a scratch folder for testing:

```bash
MATCH_TRACKER_BASE=dating-test python3 match_tracker.py schedule sarah --date 2026-07-01
```
