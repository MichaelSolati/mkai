# Vault Structure

## Philosophy: Dynamic & Slug-First

Folders are created by usage, not by schema. Claude and the user create paths as content accumulates — no empty scaffolding.

**Convention:** All paths and filenames must be **lowercase** and use **hyphens** for spaces/underscores (slug-style).

---

## Core Spheres (Life Spheres)

The vault is organized into top-level "spheres" that represent different areas of your life and work.

### `projects/` — Engineering & Code
Per-repo and per-branch knowledge.
```
projects/
  <repo-slug>/
    index.md          <- Repo overview
    decisions.md      <- Technical decisions (appended)
    patterns.md       <- Repo-specific patterns
    mistakes.md       <- Repo-specific mistakes
    branches/
      <branch-slug>/
        notes.md      <- Working notes for active feature
```

### `identity/` — Digital Twin Foundation
The core of your AI persona.
```
identity/
  me.md               <- Your role, preferences, bio, and "Digital Twin" context
```

### `personal/` — Life Management
Personal goals, habits, health, or hobbies.
```
personal/
  goals.md
  travel/
    japan-trip.md
```

### `dating/` — Relationship Context
Preferences, logs, or profiles.
```
dating/
  preferences.md
  profiles/
    tinder-bio.md
```

### `_meta/` — Infrastructure
Maintained by maintenance commands.
```
_meta/
  index.md            <- "Map of the Brain" (auto-rebuilt by /brain-map)
```

---

## Scoping Model

The `brain` command resolves scopes to the correct file path automatically:

| Level | Scope | Example Path | When to use |
|-------|-------|--------------|-------------|
| Global | `--scope global` | `global/patterns.md` | Applies across all work/life |
| Repo | `--scope <repo>` | `projects/<repo>/decisions.md` | Specific to a codebase |
| Branch | `--scope <repo>/<branch>` | `projects/<repo>/branches/<branch>/notes.md` | Ephemeral feature work |
| Category| `--scope <category>` | `<category>/decisions.md` | Arbitrary sphere (dating, health) |

---

## Path Normalization Rules

1.  **Lowercase**: `Projects` -> `projects`
2.  **Hyphenate**: `My Repo` -> `my-repo`
3.  **Strip Underscores**: `user_settings` -> `user-settings`
4.  **No Trailing Slashes**: (For note paths)

---

## Organic Growth

Everything outside the core schema is organic. Claude should follow these rules when adding content:

*   **List First**: Always `list` the parent folder to see existing naming patterns.
*   **Prefer Depth**: Don't create top-level folders if the content fits in an existing sphere.
*   **Ask if Unsure**: If a piece of knowledge doesn't clearly fit into `projects`, `personal`, `dating`, or `work`, ask the user where to place it.
