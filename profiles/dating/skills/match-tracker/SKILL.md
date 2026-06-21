---
name: match-tracker
description: "Manage dating-app matches end-to-end: create per-match dossiers and conversation logs in your Obsidian vault, log incoming exchanges, craft replies via message-crafter, and keep profiles up to date - all through natural conversation. Use when someone says 'new match', 'log her reply', 'what should I say to', 'matched with', 'she said', 'update profile', 'active matches', or wants help with an ongoing dating conversation."
argument-hint: "Who is the match and what do you need? (new match, log exchange, craft reply, update profile, or list active)"
---

# Match Tracker

## What This Skill Does

Single entry point for everything related to a specific match. You talk naturally - "new match Sarah on Hinge", "Nina just replied, what do I say?", "log this exchange" - and the skill handles all vault plumbing automatically.

It does **not** reimplement message crafting or voice analysis. It delegates:
- **Conversation vault management** → `obsidian` skill (read/write/append/patch)
- **Message crafting** → `message-crafter` skill (via Skill tool)
- **Voice grounding** → reads `my-voice` profile + dating-specific samples from vault

---

## Trigger Recognition

Route to the correct operation based on what the user says:

| Signal | Operation |
|--------|-----------|
| "new match", "matched with [Name] on [App]", "I matched with" | **New match** |
| "she replied", "she said", "[Name] said", "log this exchange", "log her reply", "she sent" | **Log exchange** |
| "what should I say to [Name]", "help me reply to [Name]", "draft a message for [Name]", "how should I respond to [Name]", "opener for [Name]" | **Craft reply** |
| "update [Name]'s profile", "[Name] told me she", "add to [Name]'s notes", "[Name] mentioned", "add a note about [Name]" | **Update profile** |
| "active matches", "who am I talking to", "list my matches", "who are my matches", "dating status" | **List active** |
| "update my voice samples", "update my texting samples", "re-calibrate my voice" | **Voice refresh** |
| "update my profile", "save this about me", "add to my dossier", "remember that I", "I'm a [fact about self]", "I work as" | **Update my profile** |
| "what do you know about me", "show my profile", "read my dossier", "what's in my dossier" | **View my profile** |

When the person's name is ambiguous, ask. When the operation is ambiguous, ask. Keep clarifying questions to one at a time.

---

## Name Collisions

Matches are stored at `dating/<name-slug>/`. When a name collides, follow these rules (folders in the vault are always in lowercase-slug format, e.g. `sarah` or `sarah-m`).

### At new-match intake (Operation 1)

Before writing any files, run `obsidian list dating/` and check whether a folder whose name matches the normalized `<First>` already exists (e.g. check if there is a folder named `<first>` or starting with `<first>-`).

1. **No existing folder** → proceed normally, no suffix needed. `dating/sarah/`
2. **Exact folder match** (e.g. `sarah` exists and you're adding another Sarah):
   - Ask the user for both Sarahs' last initials: "There's already a Sarah in your vault (Bumble, matched 2026-04-15). What's her last initial? And the new Sarah's last initial?"
   - If **both initials known**: rename the existing folder to `dating/sarah-k/` and create the new one as `dating/sarah-m/`.
   - If **one or both initials unknown**: fall back to platform suffix using the `**Platform:**` field from each `conversation.md` → `dating/sarah-bumble/` and `dating/sarah-hinge/`. (Hyphen distinguishes platform suffix from initial suffix.)
   - If **platform also collides** (same app): use ordinal by match date → `dating/sarah-1/` (earlier), `dating/sarah-2/` (later).
3. **Partial folder match** (e.g. `dating/sarah-k/` exists and you're adding a third Sarah K): apply the same escalation pairwise. Add a platform suffix to the colliding one: `dating/sarah-k-hinge/` vs the existing `dating/sarah-k/`.
4. **Always confirm before renaming**: "There's already a Sarah on Bumble (matched 2026-04-15). I'll rename her to 'Sarah K' and create the new one as 'Sarah M' - okay?" Never rename silently.
5. Record the chosen disambiguator type in both profiles' Quick Facts (`Display name:` and `Disambiguator type:` fields).

See `references/workflows.md` Section 9 for the rename shell sequence.

### At lookup (Operations 2, 3, 4 - any named-match operation)

1. Run `obsidian list dating/` and collect all folders whose name matches the normalized `<First>` (e.g., folders starting with `<first>` as a word segment, case-insensitive).
2. **Exactly one match** → proceed directly.
3. **More than one match** → read each `conversation.md` header and surface candidates:
   > "Which Sarah? - Sarah K (Hinge, last exchange 2026-05-28) or Sarah M (Bumble, matched 2026-05-30, no exchanges yet)?"
   Wait for the user's answer. Never guess.
4. **Zero matches** → say so and offer to start a new-match flow.

---

## Operations

See `references/workflows.md` for step-by-step details on each operation.

### 1. New match

Build the vault presence for a new person.

1. Ask: name, app (Hinge/Bumble/Tinder), "what caught your eye about her?"
2. Ask user to paste her full profile - all prompts/answers, bio, photos described, any visible facts (age, job, location, education, height).
3. Build `profile.md` from `references/profile-template.md` with parsed details → `obsidian write "dating/<name-slug>/profile.md" --file $TMPDIR/profile.md`
4. Build `conversation.md` skeleton from `references/conversation-template.md` with Pre-Match Strategy filled in → `obsidian write "dating/<name-slug>/conversation.md" --file $TMPDIR/conversation.md`
5. Ask: "Want me to craft an opener now?"

### 2. Log exchange

Record what she sent without writing a reply yet.

1. `obsidian read "dating/<name-slug>/conversation.md"` - get current state + last exchange number.
2. Ask: what did she send, what date, was it a response to something specific?
3. Build `## Exchange N` block → `obsidian append "dating/<name-slug>/conversation.md" --file $TMPDIR/exchange.md`
4. Scan for profile-worthy signals (new info about her life, friction, strong compatibility note). If found: prompt to update profile now or later.
5. Ask: "Want me to help draft a reply?"

### 3. Craft reply

Assemble full context and delegate to message-crafter.

1. Read vault context:
   ```
   obsidian read "dating/<name-slug>/profile.md"
   obsidian read "dating/<name-slug>/conversation.md"
   obsidian read "dating/_meta/my-profile.md"
   ```
   If `my-profile.md` is absent → note "no user dossier yet - say 'update my profile' to start one" and proceed without it.
2. Load voice context (see `references/voice-handoff.md`):
   - Try to read `dating/_meta/voice-samples.md`; if absent, run **Voice refresh** first
   - Try to read `~/.mkai/profiles/writing/skills/my-voice/references/voice-profile.md`; absent = proceed without, note "run /voice-setup to enrich"
3. Assess conversation stage from the thread (opener / early-game / mid-game / date-seed / recovery / logistics).
4. Invoke `message-crafter` via Skill tool with `args` containing the full assembled context block (see `references/voice-handoff.md` for exact format).
5. Present message-crafter's options verbatim, including its rationale.
6. **Stop and wait.** Do NOT append anything to conversation.md yet.
7. When user says "I sent option [X]" or pastes the actual text:
   - Append a `## My Reply (YYYY-MM-DD)` block under the current exchange via `obsidian append "dating/<name-slug>/conversation.md" --file $TMPDIR/reply.md`

### 4. Update profile

Add or revise information on an existing match.

1. `obsidian read "dating/<name-slug>/profile.md" --map` to see current sections.
2. Determine target section from what the user shared. Most new observations go into `## Notes & Observations`.
3. For appending within a section: `obsidian patch "dating/<name-slug>/profile.md" --target-type heading --target "Notes & Observations" --operation append --file $TMPDIR/note.md`
4. For adding compatibility/friction signals: target `## Compatibility Signals` or `## Potential Friction` respectively.
5. For substantive facts (new job, moved, etc.): target `## Quick Facts` with replace, not append.
6. Confirm what was added.

### 5. Update my profile

Add or revise information in the user's own dossier at `dating/_meta/my-profile.md`.

1. If `my-profile.md` doesn't exist yet, create it from `references/my-profile-template.md`.
2. `obsidian read "dating/_meta/my-profile.md" --map` to see current sections.
3. Determine target section from what the user shared (Quick Facts for concrete facts, Identity & Personality for who-I-am statements, What I'm Looking For for relationship goals, Dealbreakers for hard nos, etc.).
4. For appending within a section: `obsidian patch "dating/_meta/my-profile.md" --target-type heading --target "<Section>" --operation append --file $TMPDIR/note.md`
5. For updating stale facts (new job, moved): `--operation replace` on the relevant section.
6. Confirm what was added.

### 6. View my profile

Read back the user's own dossier so they can audit or direct edits.

1. `obsidian read "dating/_meta/my-profile.md"` - display full contents.
2. Offer: "Anything you want to add, update, or remove?"

### 7. List active

Surface the current match landscape.

1. `obsidian list dating/` → get folder names.
2. For each name, read the metadata block of `conversation.md` (first ~10 lines after `---` separator).
3. Build a table: **Name | App | Matched | Status | Last Exchange**.
4. Offer: "Which match do you want to focus on?"

### 8. Voice refresh

Update the texting-specific voice calibration file.

1. Ask: "Paste 5–10 recent texts you've sent - to anyone (friends, family, doesn't have to be dating)."
2. Format as a clean block preserving the user's natural style exactly.
3. Write to vault: `obsidian write "dating/_meta/voice-samples.md" --file $TMPDIR/voice-samples.md`
4. Confirm saved. On next craft-reply, the new samples will be picked up automatically.

---

## Multi-Step Conversations

After completing any operation, stay in context - don't exit the skill. The user may:
- Reply to the drafted messages ("she said X, what now?") → loop into **log exchange** → **craft reply**
- Add profile info mid-conversation ("oh also she mentioned she lives in Brooklyn") → run **update profile** inline, then continue
- Ask about a different match → confirm name switch, reload vault context

---

## Auto-Capture Suggestions

During any conversation flow, stay alert for identity-level signals the user reveals about themselves - not about the match. Examples:

- Logging an exchange where the user mentions their job, neighborhood, or a hobby
- A dealbreaker that surfaces mid-craft ("I'm not into someone who X")
- A date idea the user proposes that reveals go-to spots or interests
- A preference pattern that comes up ("I always find it annoying when...")

When a signal like this appears, **proactively offer** to save it: "Want me to add that to your dossier?" Give a brief preview of which section it would go under. Never auto-write - always confirm first.

This keeps the dossier growing organically without requiring the user to remember to update it.

---

## Notes

**Never fabricate context.** If `profile.md` or `conversation.md` don't exist for a name the user mentions, say so and offer to create them (new match flow) rather than proceeding with empty context.

**Same-name collisions are eager-resolved.** When a second match shares a first name with an existing one, both folders get a disambiguator (last initial → platform → ordinal). Never leave one bare while the other has a suffix. Confirm the rename with the user before executing. See "Name Collisions" above.

**No auto-logging.** Only append sent messages to conversation.md after explicit user confirmation ("I sent it", "I went with B"). Draft options alone never touch the vault.

**Templates are strict.** Use the structures in `references/profile-template.md`, `references/conversation-template.md`, and `references/my-profile-template.md` exactly - they match the existing Dating/ vault layout.

**Dossier vs. match profile disambiguation.** Operations 5 and 6 are about *the user*. Operations 4 (update profile) and all other named-match ops are about a *match*. When the user says "update my profile" they mean their dossier. When they say "update [Name]'s profile" they mean a match. If ambiguous, ask.

**TMPDIR for writes.** All multi-line content must be written to `$TMPDIR/<name>.md` first and passed with `--file`. Never inline multi-line markdown as a positional argument to obsidian.

---

## Related Skills

- `message-crafter` - invoked by this skill's **craft reply** flow. Can also be invoked directly for lighter-weight message help when vault context isn't needed.
- `hinge-profile-optimizer` - for optimizing YOUR Hinge profile (not a match's dossier). Reads and writes the same `dating/_meta/my-profile.md` dossier.
- `obsidian` - vault primitives this skill builds on.
- `my-voice` - voice profile baseline; run `/voice-setup` once to generate it. Its `voice-profile.md`, `sample-excerpts.md`, and anti-slop references are all loaded into craft-reply context.
