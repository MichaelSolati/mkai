# Dating Profile

**Research-backed dating profile optimization in ~45 minutes.**

Everyone has something - the way they think, what they care about, their weird specific interests. Most dating profiles bury this under generic prompts and bad photo choices. This skill finds it and puts it where people can see it.

---

## What's Included

**3 skills:** `hinge-profile-optimizer`, `match-tracker`, `message-crafter`

### `match-tracker` - Conversation & dossier manager

The orchestrator. Manages everything related to a specific match through natural conversation: creates per-match dossiers and conversation logs in your Obsidian vault, logs incoming exchanges, assembles full context (her profile + thread + your voice), and delegates to `message-crafter` for reply options. Only logs your sent messages after you confirm. Invoke conversationally: *"new match Sarah on Hinge"*, *"Nina just replied"*, *"what should I say to Penelope?"*, *"active matches"*.

### `hinge-profile-optimizer` - Your profile

A structured 8-phase process:

| Phase | What Happens |
|-------|--------------|
| Setup | Frame the process, understand your situation |
| Audit | Score your current profile (skip if starting fresh) |
| Discovery | The big interview - find what actually makes you *you* |
| Reality Check | Honest market math - who are you competing for? |
| Photos | Evaluate, order, identify gaps |
| Copy | Write prompts using *your* material, not templates |
| Settings | Optimize visibility, hide the clutter |
| Implementation | Put it live together |
| Algorithm | What to do in weeks 1-4 |

Not everyone needs every phase. The skill adapts.

### `message-crafter` - Messaging strategy

Stateless message crafter for openers, mid-conversation replies, date asks, and recovery. Generates 2–3 options at different tones with per-option reasoning. Invoked directly by `match-tracker` during the craft-reply flow, or stand-alone for lighter-weight help without full vault context.

---

## Usage

```sh
mkai activate dating
```

Then tell your agent: *"Help me optimize my Hinge profile"*

---

## Research Foundation

Grounded in 29+ peer-reviewed studies, platform data from Hinge and OkCupid, and signaling theory. Key findings:

- **Specific language beats generic** - "Jazz Cafe on a weeknight" > "live music" (Toma & Hancock, 2012)
- **Showing beats telling** - demonstrated traits are costly signals; claimed traits are cheap signals (Donath, 2007)
- **The market is unequal** - power-law distribution means differentiation > broad appeal (Bruch & Newman, 2018)
- **Photos drive the swipe** but text matters more on prompt-based apps like Hinge (Brand et al., 2012; Fiore et al., 2008)

Full citations in `skills/hinge-profile-optimizer/research-findings.md`.
