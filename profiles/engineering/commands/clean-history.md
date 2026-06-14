---
description: Rebuild git history as a clean sequence of self-contained commits - auto-discovers repo shape, consolidates migrations, respects dependency order
argument-hint: "[full | partial N] [--rhythm work|side|both] -- 'full' for orphan-branch replay (default); 'partial N' to rebuild last N commits; '--rhythm' picks the time-of-day pattern (default: both)"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Write
  - AskUserQuestion
---

# /clean-history - Replay a Repo's History as Clean, Logical Commits

Rebuild the git history of the current repo so each commit is a self-contained, logical unit - as if the project was implemented in the correct order the first time. Tests ship with their module, generated code arrives after its source spec, migrations are consolidated to a single clean schema, no fix-up commits.

This is destructive to local branches but never to the original history (kept under an archive tag/branch). It is **never** automatic past the gates.

## Modes

Parse `$ARGUMENTS`:

- `full` (default): orphan-branch rebuild from scratch.
- `partial <N>`: rebuild only the last `N` commits, preserving everything before `HEAD~N`.

If `$ARGUMENTS` is anything else, ask the user which mode they want.

### Rhythm

Parse the optional `--rhythm` flag (default `both`). The rhythm controls when commits are allowed to land on the calendar:

- `work`: Mon–Fri, 09:00–18:00 local
- `side`: Mon–Fri 18:00–23:00, Sat/Sun 10:00–22:00 local
- `both`: Mon–Fri 09:00–23:00, Sat/Sun 10:00–22:00 local

If `--rhythm` is provided but not one of `work|side|both`, ask the user which mode they want before proceeding.

## Iron Law

```txt
NO EXTRACTION OR REWRITES UNTIL DISCOVERY + COMMIT PLAN + MIGRATION DIFF
HAVE BEEN APPROVED AT EACH GATE.
```

If a gate is not approved, stop. Do not "just take a quick look" by running git operations.

## Tunables (edit in place)

These defaults drive the timeline computation in Phase 2.5. Edit the values directly in this file to adjust.

```sh
# Effort estimation (minutes per commit)
BASE_MIN_PER_COMMIT=30           # baseline thinking/setup time
MIN_PER_25_LOC=1                 # +1 min per 25 lines added
MIN_PER_FILE=5                   # +5 min per file added/modified

# Phase overrides (flat minutes - bypass the formula above)
SCAFFOLD_FLAT_MIN=15
SCHEMA_GEN_FLAT_MIN=2            # generated client/SDK code
MIGRATIONS_FLAT_MIN=10           # consolidated migration set
GENERATED_SDK_FLAT_MIN=2

# Foundation-cluster behavior
FOUNDATION_PHASES="scaffold,schema-defs,schema-gen,migrations"
FOUNDATION_INTRA_GAP_MIN=45      # minutes between foundation commits
FOUNDATION_JITTER_MIN=20         # ± minutes around each foundation slot
FOUNDATION_TOTAL_SPAN_HOURS=8    # cap so foundation never spans >1 day

# Rhythm jitter
SLOT_JITTER_MIN=15               # ± minutes around each computed slot

# Calendar caps
MAX_TIMELINE_DAYS=180            # warn + offer to compress if exceeded
```

## Phase 0 - Preconditions

Refuse to proceed if any of these are true. Report which one and stop.

- Not inside a git repo (`git rev-parse --is-inside-work-tree`).
- Working tree not clean (`git status --porcelain` non-empty).
- Rebase, merge, cherry-pick, or bisect in progress.
- Detached HEAD with no branch.
- For `partial N`: `N` is missing, non-numeric, or larger than the commit count on the current branch.

Record the current branch name as `<base>` and the current SHA as `<base-sha>`. Emit the timestamp as `<ts>` (e.g. `20260602-1430`).

## Phase 1 - Discovery (read-only)

Auto-detect the repo's shape. Do not assume any directory layout. Run these probes in parallel where practical.

### 1a. Stack signals

Glob from repo root for:

- `go.mod`, `go.work`
- `package.json`, `nx.json`, `pnpm-workspace.yaml`, `turbo.json`
- `pubspec.yaml`
- `Cargo.toml`
- `pyproject.toml`, `setup.py`, `requirements*.txt`
- `pom.xml`, `build.gradle*`
- `Gemfile`
- `composer.json`

A repo can match several (monorepos commonly do). Record all matches with their paths.

### 1b. Entry points / wire-up

These files reveal the module dependency graph because they import everything in DI/registration order:

- `cmd/*/main.go`
- `apps/*/src/main.{ts,tsx,js}`, `apps/*/main.{ts,tsx,js}`
- `src/index.{ts,js}`, `src/server.{ts,js}`, `src/app.{ts,js}`
- `lib/main.dart`, `lib/app.dart`
- `src/main/java/**/Application.java`

Record paths. If multiple, the largest one (by import count) is the primary.

### 1c. Module roots

Glob each candidate pattern. Pick the one where the parent directory has the most siblings each containing source files (signal: this is where domain modules live). Fall back through this list:

1. `server/internal/*/`, `internal/*/`
2. `apps/*/`, `libs/*/`, `packages/*/`
3. `src/modules/*/`, `src/features/*/`, `src/domains/*/`
4. `lib/features/*/`, `lib/modules/*/`
5. `app/*/` (Rails/Phoenix), `pkg/*/` (Go)
6. Top-level subdirs of `src/` if none of the above match

Record: pattern, count, list of module names.

### 1d. Migration system

Detect by precedence (first match wins):

- `prisma/schema.prisma` + `prisma/migrations/` → Prisma
- `**/migrations/*.{ts,js}` matching `/^\d+-/` and importing TypeORM → TypeORM
- `db/migrate/*.rb` → Rails
- `alembic.ini` or `migrations/versions/*.py` → Alembic
- `migrations/*.up.sql` + `*.down.sql` → golang-migrate / dbmate (raw SQL)
- `db/migrations/*.sql` → generic raw SQL
- None of the above → record "no migrations".

Record: system, directory, pair count, naming pattern.

### 1e. Generated artifacts

Glob for telltales - these must be committed AFTER the source they're generated from:

- `**/ent/{client,enttest,*_query,*_create}.go` → ent codegen output
- `**/graph/generated/*.go`, `**/__generated__/*` → gqlgen / Relay
- `**/*.g.dart`, `**/*.freezed.dart` → Dart codegen
- `**/*_pb.go`, `**/*_pb2.py`, `**/*.pb.cc` → protobuf
- `docs/swagger.{json,yaml}`, `openapi.{json,yaml}` → OpenAPI
- `client/packages/*/lib/api/`, `**/sdk/generated/*` → OpenAPI client SDK

Record each detected generator: source path → generated path.

### 1f. Test layout

For each module root, check whether tests live alongside source (`*_test.go`, `*.test.ts`, `*_test.dart`) or in a separate tree (`test/`, `tests/`, `__tests__/`). Record per-module so Phase 2 knows whether to bundle tests with their module commit or carve out a separate test phase.

### Discovery report - GATE 1

Print a tree-shaped manifest with all of the above. Example shape:

```
Repo: <name> (branch <base>, mode <full|partial N>)
Stacks detected: Go, Flutter
Entry points:
  primary: server/cmd/server/main.go
  others: server/cmd/seed/main.go, client/lib/main.dart
Module roots:
  server/internal/*/  → 16 modules: admin, auth, ..., social
  client/lib/features/*/  → 8 modules: auth, profiles, ..., search
Migrations: golang-migrate, server/migrations/, 61 pairs (000001 .. 000061)
Generated artifacts:
  schema → server/internal/ent/    (codegen output)
  swagger annotations → server/docs/swagger.{json,yaml}
  swagger.yaml → client/packages/feedist_api/  (Dart SDK)
Tests: co-located in server/internal/*/, separate tree client/test/
```

Ask the user to confirm before continuing. If anything looks wrong, ask them to correct it manually (e.g., "treat `pkg/util` as a module root too") - re-detection is cheaper than a wrong commit plan.

## Phase 2 - Dependency Graph + Commit Plan

### 2a. Build the import graph

For each module root, parse imports to determine cross-module edges. Restrict to **internal** imports - don't graph stdlib or third-party.

- **Go**: in each module dir, run `go list -f '{{.ImportPath}} {{join .Imports " "}}' ./...` if Go tooling is available; otherwise grep `^import` blocks and filter to paths starting with the module's own `go.mod` path.
- **TypeScript**: parse `import ... from '...'` and `require(...)` strings. Resolve `tsconfig.json` `paths` and `baseUrl`. For NX, also read `nx.json` / `project.json` `implicitDependencies`.
- **Dart**: parse `import 'package:<repo_name>/...'` from `pubspec.yaml`'s `name` field.
- **Python**: parse `from <pkg> import` and `import <pkg>` where `<pkg>` is a local package.
- **Java/Kotlin**: parse `import <root_pkg>...` where `<root_pkg>` matches the project's group id.
- **Other**: if you're unsure how to extract, ask the user for one example file and the expected pattern, then proceed.

Topo-sort. If cycles exist, report them - cycles indicate the original code has a circular dependency, which the clean history cannot honor. Ask the user how to break the cycle (usually: extract a shared interface, or merge two modules into one commit).

### 2b. Compute commit phases

Build the commit sequence using these phases. Each phase that produces zero files is skipped.

1. **Scaffold** (1 commit): everything that is *not* a domain module, migration, generated artifact, app-level wiring, or test directory. This is repo metadata, build config, lints, CI, top-level docs, framework boilerplate.
2. **Schema definitions** (1 commit, if applicable): ent schemas, Prisma schema, sqlalchemy models, TypeORM entities - the source-of-truth declaration *before* generated code.
3. **Generated schema code** (1 commit, if applicable): ent client output, generated migration helpers - committed only if needed at compile time by later phases.
4. **Migrations** (1 commit): consolidated set from Phase 3.
5. **Platform / infrastructure** (1+ commits): modules with zero internal dependencies (config, db driver wrapper, redis client, logging, generic middleware, test utilities). One commit per module, ordered by name.
6. **Domain modules** (N commits): one commit per module in topo-sort order. Bundle tests if co-located.
7. **Wire-up** (1 commit): the entry points and route/DI registration.
8. **API contract** (1 commit, if applicable): OpenAPI spec generated from handler annotations.
9. **Generated SDK** (1 commit, if applicable): client SDK generated from the API contract.
10. **Client app modules** (N commits, if applicable): if there's a separate client codebase, repeat phases 5-7 for it (foundation → features in topo order → wire-up).
11. **Tests** (1 commit, if applicable): test directories that are NOT co-located with their module.

For each commit, prepare:

- Conventional-commit-style message: `<type>(<scope>): <imperative summary>`. Types: `feat`, `fix`, `build`, `docs`, `test`, `chore`. Scope = module or phase name.
- File list. Use `git ls-tree -r <base-sha> --name-only` filtered against the phase's path prefixes - never invent paths.

### 2c. Resolve shared-file growth (hybrid ownership)

A shared file is one whose path is NOT inside any single module root - typically `internal/platform/`, `lib/core/`, `libs/shared/`, `pkg/util/`, `internal/types/`. These files often grow over time as later modules need new helpers.

For each shared file:

- List its top-level symbols (functions, types, classes, constants).
- For each symbol, find the **earliest commit** in the planned sequence that imports/references it, by grepping the consumer set against the topo order.
- If all symbols share the same earliest commit: ship the whole file in that commit.
- If symbols split across commits: **slice** the file. Each commit adds only the symbols its consumers need. The file grows over the history; no commit declares dead code that it doesn't use.
- If a symbol has no consumer (dead code at HEAD): warn and ask the user - usually the right answer is to delete it, but the user decides.
- Tie-break ambiguous ownership by asking the user once with the candidate symbols listed. Don't ask again later for related symbols - record the rule (e.g., "all `*Repository` interfaces ship with the platform commit").

This is the hardest part of the command. It is acceptable to spend most of the planning time here. If slicing produces a syntactically broken intermediate file (e.g., a method references a private helper that doesn't exist yet in this commit), promote the missing helper into the same commit.

### 2d. Verify each commit is self-contained

For each planned commit, simulate the build set: union of files added in this commit and all prior commits. Spot-check by:

- Confirming every `import` in the new files resolves to a file present in the simulated set, or to an external dependency declared in the manifest (`go.mod`, `package.json`, etc.).
- Confirming generated code commits are preceded by their source spec commits.
- Confirming the wire-up commit is preceded by every module it imports.

If any commit fails this check, surface the missing prerequisite and ask whether to (a) move the missing files into this commit or (b) re-order. Don't silently shuffle.

### Commit plan - GATE 2

Print the plan as:

```
Commit  Phase           Type        Message                               Files
01/35   scaffold        feat        initialize repo with Go, Flutter,...   42
02/35   schema-defs     feat        define ent entity schemas              18
03/35   schema-gen      build       run ent codegen                        93
04/35   migrations      feat        add consolidated schema migrations     61 → 36
...
```

Show the per-symbol slicing decisions for any shared file that's been split. Show any cycles, dead code, or ambiguous ownership the user resolved. Ask for approval. Do not write anything yet.

## Phase 2.5 - Timeline Computation

Inputs: approved commit plan from Phase 2, the Tunables block at the top of this file, the `--rhythm` mode (default `both`), and the current local time.

This phase computes a per-commit author/committer date and a per-file final mtime so the rebuilt history looks organically authored instead of mass-rewritten. It runs after the commit plan is approved but before any extraction script is generated. No git operations happen here - it's pure computation.

### 2.5a. Estimate effort per commit

For each commit in the plan, derive the inputs:

- **insertions** = sum of `git show <base-sha>:<path> | wc -l` for every file added in this commit. For sliced shared files (Phase 2c), count only the lines in this commit's slice, not the whole file.
- **files** = number of paths the commit will touch.

Compute effort minutes:

- If commit phase ∈ `FOUNDATION_PHASES` → use that phase's flat override (`SCAFFOLD_FLAT_MIN`, `SCHEMA_GEN_FLAT_MIN`, `MIGRATIONS_FLAT_MIN`, etc.).
- Else → `effort = BASE_MIN_PER_COMMIT + (insertions / 25) * MIN_PER_25_LOC + files * MIN_PER_FILE`.

### 2.5b. Foundation cluster spacing

Take all commits whose phase ∈ `FOUNDATION_PHASES`, in plan order. Pack them with `FOUNDATION_INTRA_GAP_MIN` spacing, then apply ± `FOUNDATION_JITTER_MIN` jitter to each gap.

Cap total cluster span at `FOUNDATION_TOTAL_SPAN_HOURS` - if the packed sequence would exceed that, shrink all intra-cluster gaps proportionally so the total fits.

The cluster is *not* placed on the calendar yet. It will anchor to the first non-foundation commit's slot (computed in 2.5c) minus `FOUNDATION_INTRA_GAP_MIN`.

### 2.5c. Place non-foundation commits - backward from now

End anchor = current local time, snapped to the nearest active rhythm slot in the past. (E.g., if it is 02:00 on a weekday in `work` mode, snap to 18:00 of the most recent weekday.)

Walk the non-foundation commits in reverse plan order. For each:

1. Subtract `effort(commit)` minutes of *active rhythm time* from the cursor.
2. "Active rhythm time" means time inside the rhythm window for the chosen mode. When the cursor crosses an inactive period (nights, weekends, etc.), skip backward past that gap and keep subtracting until the full effort budget has been consumed.
3. Apply ± `SLOT_JITTER_MIN` jitter to the resulting timestamp using a fresh PRNG seed each run.

Result: every non-foundation commit has a placed timestamp on the calendar.

After the loop, place the foundation cluster: its last commit lands at the earliest non-foundation timestamp minus `FOUNDATION_INTRA_GAP_MIN`, and the rest of the cluster fills backward using the spacing computed in 2.5b. Foundation commits are *not* required to fall inside the rhythm window - they represent project kickoff and may land at any hour.

### 2.5d. Sanity checks

- **Total span**: `last_commit_time − first_commit_time` must be ≤ `MAX_TIMELINE_DAYS`. If not, warn the user and offer:
  - (a) accept the long span as-is,
  - (b) scale all gaps down by `total / cap` so the timeline fits,
  - (c) abort and ask the user to adjust tunables.
- **Monotonicity**: every commit's jittered timestamp must be strictly greater than the previous commit's. If a jitter pair flips order, reroll just that pair.
- **Partial mode**: for `partial N`, the first new commit's timestamp must be strictly greater than the last preserved commit's committer date. If not, abort and report that the estimated effort doesn't fit between the last preserved commit and now - the user should either reduce `N`, lower the tunable minutes, or pick a less restrictive `--rhythm`.

### 2.5e. Mtime computation

For each file in the rebuilt tree, walk the commit plan in chronological order. Every commit that includes the file sets the file's planned mtime to that commit's timestamp. Sliced shared files (Phase 2c) therefore advance their mtime with every slice; files only touched once keep their single commit's timestamp.

Output of this phase: two maps the extraction script will consume.

- `commit_index → ISO 8601 timestamp` (with timezone offset, e.g. `2026-02-03T19:48:00-0500`).
- `path → final ISO 8601 mtime`.

### Timeline preview - GATE 2.5

Print:

```text
Timeline (rhythm: side, jitter seed: 0x4f2a1c, span: 142 days)
  01/35  scaffold        2026-01-17 10:14  (15 min, foundation)
  02/35  schema-defs     2026-01-17 11:02  (45 min, foundation)
  ...
  09/35  feat(auth)      2026-02-03 19:48  (62 min, weekday eve)
  ...
  35/35  test(suite)     2026-06-07 16:22  (35 min, weekend)

Foundation cluster:    2026-01-17 10:14 → 2026-01-17 17:33 (7h 19m)
Total span:            2026-01-17 → 2026-06-07 (142 days, 38 active days)
```

Ask for approval. If declined, ask the user which to adjust:

- the rhythm mode (`--rhythm work|side|both`),
- one or more tunable values (point them to the **Tunables** block near the top of this file),
- or skip timestamp spreading entirely and fall back to all commits landing at script runtime.

Recompute Phase 2.5 with the new inputs and re-present the gate. Do not enter Phase 3 until 2.5 is approved.

## Phase 3 - Migration Consolidation

Skip this phase if Phase 1 detected no migrations.

### 3a. Tag every migration

Read every up migration. Tag each as one of:

- **INITIAL** - pure CREATE statements, no references to data that was previously inserted/altered.
- **ADDITIVE** - new tables or indexes for new features (still pure CREATE, but adds to the existing schema).
- **FIXUP** - anything that patches an earlier migration: `ALTER TABLE`, `DROP COLUMN`, `RENAME`, backfill `UPDATE`, data migrations, type changes.

For non-SQL systems:

- **Prisma**: read `migration.sql` inside each timestamped folder; the same INITIAL/ADDITIVE/FIXUP categorization applies.
- **TypeORM / Sequelize**: read each migration's `up()` method; classify by the operations called.
- **Alembic**: read `op.create_table` (INITIAL/ADDITIVE) vs `op.alter_column`/`op.drop_column` (FIXUP).

### 3b. Fold FIXUPs into origins

For each FIXUP, identify the migration(s) it patches. Merge the changes directly into those origin CREATE statements:

- Adding a column → add it to the original `CREATE TABLE`.
- Dropping a column → remove it from the original `CREATE TABLE`.
- Renaming → use the final name in the original.
- Type changes → use the final type in the original.
- Backfills and data migrations → delete entirely. On a fresh schema there's no data to migrate.

Delete the FIXUP file once folded.

### 3c. Resolve FK / dependency order

Walk the foreign-key graph after folding. For each `REFERENCES <other_table>` (or framework equivalent), the referenced table's migration must come first. If not, reorder.

Some migrations create indexes on tables created in later migrations - same rule, must come after the table.

### 3d. Renumber

Renumber sequentially with no gaps. Keep `.up.sql` and `.down.sql` filename pairs in sync. For Prisma/TypeORM, rename the migration folders/files and update any timestamp-based ordering.

### 3e. Rewrite down migrations

For any migration whose up changed (added columns, added join tables), regenerate the corresponding down to reverse the *final* consolidated state, not the original partial state. For TypeORM, rewrite `down()` symmetrically.

### 3f. Cross-check schema sources

The schema definitions from Phase 2 step 2 (ent schemas, Prisma schema, models) should already match HEAD because they track the live schema, not migration history. Diff them against the consolidated SQL:

- Every column in `CREATE TABLE` should map to a field in the schema definition.
- Every field in the schema definition should map to a column.
- Indexes and constraints should match.

If they don't match: the schema source is wrong (a removed column was never deleted from the model, etc.). Fix the schema source - that becomes part of the schema-defs commit.

### 3g. For opaque migration formats

Prisma's shadow-database approach means migrations sometimes contain implementation-specific snapshots that aren't easily folded by hand. If the user has Prisma + complex migrations, offer this alternative:

1. Take the current `schema.prisma` (which already reflects HEAD).
2. Delete the entire `prisma/migrations/` directory.
3. Run `prisma migrate dev --name init` to generate a single fresh `init` migration.
4. That single migration replaces the entire history.

This is faster and safer for Prisma than file folding. Same approach works for any "schema-first" tool.

### Migration diff - GATE 3

Print a diff summary:

```
Migrations: 61 → 36
  INITIAL kept:    8
  ADDITIVE kept:   28
  FIXUP folded:    25 (deleted: 000007, 000012, ..., 000061)
  Renumbered:      yes (gaps removed)
  Down rewritten:  14 files
Schema source fixes:
  - removed `media_id` from MediaSchema (column was dropped in 000033)
  - renamed `username` → `handle` in ProfileSchema (renamed in 000019)
```

Get approval. If declined, ask which folds to undo or which to do differently - don't restart from scratch.

## Phase 4 - Execution

Only enter this phase after all three gates have been approved.

### 4a. Snapshot the originals

```bash
# Tag the current tip; this is the source of truth for the file-content diff check
git tag <base>-archive-<ts>
```

For `partial N`, additionally:

```bash
git branch <base>-backup-<ts>
```

### 4b. Create the working branch

For `full`:

```bash
git checkout --orphan clean-history
git rm -rf --quiet .  # working tree, not the index of the archive tag
```

For `partial N`:

```bash
git checkout -b clean-history-partial <base-sha>~N
# we'll replay the last N commits' worth of files on top of this
```

### 4c. Generate the extraction script

Write a single bash script to `$TMPDIR/clean-history-extract.sh`. It must run on macOS bash 3.x:

- No `declare -A` (associative arrays) - use positional functions or parallel arrays.
- Use `set -euo pipefail`.
- Reference the archive tag for files: `git show <base>-archive-<ts>:<path> > <path>`.
- For sliced shared files (Phase 2c), write the content directly via heredoc instead of `git show`.
- After writing each commit's file set:
  - `chmod +x` any `*.sh` files (preserve executable bits - git tracks them but `git show` to stdout doesn't restore them).
  - `git add -- <files>` (explicit list, not `git add .`).
  - Run `git commit` with `GIT_AUTHOR_DATE` and `GIT_COMMITTER_DATE` set to the timestamp Phase 2.5 computed for this commit. **No co-author attribution.** **No `--no-verify`.**
  - Run `touch -t <commit-mmddhhmm>` on every file in the commit to set its mtime to the commit's date.
- After the final commit, run a single mtime pass over the `path → final-mtime` map from Phase 2.5e so files touched in multiple commits end up with the mtime of their last-touching commit (rather than the first one that introduced them).

Script structure (bash 3.x compatible):

```bash
#!/usr/bin/env bash
set -euo pipefail

ARCHIVE="<base>-archive-<ts>"

extract() {
  local path="$1"
  mkdir -p "$(dirname "$path")"
  git show "$ARCHIVE:$path" > "$path"
  case "$path" in
    *.sh) chmod +x "$path" ;;
  esac
}

# Convert ISO 8601 (e.g. 2026-02-03T19:48:00-0500) to BSD touch -t format (YYYYMMDDhhmm.SS).
iso_to_touch() {
  date -j -f '%Y-%m-%dT%H:%M:%S%z' "$1" '+%Y%m%d%H%M.%S'
}

commit_phase_at() {
  local commit_date="$1"
  local message="$2"
  shift 2
  local files=("$@")
  for f in "${files[@]}"; do extract "$f"; done
  git add -- "${files[@]}"
  GIT_AUTHOR_DATE="$commit_date" GIT_COMMITTER_DATE="$commit_date" \
    git commit -m "$message"
  local touch_stamp
  touch_stamp="$(iso_to_touch "$commit_date")"
  for f in "${files[@]}"; do touch -t "$touch_stamp" "$f"; done
}

# Final pass: set each path's mtime to its last-touching commit (Phase 2.5e map).
finalize_mtime() {
  local path="$1"
  local final_iso="$2"
  touch -t "$(iso_to_touch "$final_iso")" "$path"
}

# --- Commit 01/35: scaffold ---
commit_phase_at "2026-01-17T10:14:00-0500" "feat(scaffold): initialize repo" \
  ".gitignore" \
  "go.mod" \
  "go.sum" \
  ...

# --- Commit 02/35: schema-defs ---
...

# --- Final mtime reconciliation (Phase 2.5e map) ---
finalize_mtime "internal/platform/db.go"   "2026-04-22T15:08:00-0400"
finalize_mtime "internal/platform/cache.go" "2026-05-11T20:31:00-0400"
...
```

For sliced shared files, replace the `extract` call with a `cat > "$path" <<'EOF'` heredoc containing the per-commit slice content. Be careful with shell-special characters in the slice (`$`, backticks, backslashes); switch to `cat > "$path" <<'PERFECTLY_QUOTED_EOF'` if needed.

### 4d. Run the script and verify

Execute. If it fails on a commit, stop, leave the branch as-is, and report which commit failed. Do not auto-recover - file-by-file recovery is too easy to do wrong.

After the script completes, the working branch should contain exactly the same file content as `<base>-archive-<ts>`.

## Phase 5 - Verification

Run all of these. Each must pass. If any fails, leave everything in place (archive tag, archive branch, new branch) and report.

```bash
# 1. Identical file content (the most important check)
git diff <base>-archive-<ts> HEAD -- . | wc -l   # must be 0

# 2. Identical file count
git ls-tree -r <base>-archive-<ts> --name-only | wc -l
git ls-tree -r HEAD --name-only | wc -l          # must match

# 3. Build at HEAD (stack-appropriate, detected from Phase 1)
# Go:       go build ./... && go vet ./...
# Node/TS:  pnpm build  (or npm run build / yarn build)
# Flutter:  flutter analyze
# Rust:     cargo check
# Python:   python -m py_compile $(git ls-files '*.py')

# 4. Tests at HEAD (only if cheap; skip for repos with multi-minute test suites unless user opts in)

# 5. Timestamps within window and monotonic
#    `git log` prints newest first, so reverse before checking strictly increasing.
git log --format=%aI | tail -r | awk 'NR>1 && $0 <= prev {exit 1} {prev=$0}'
git log --format=%aI | head -1   # newest commit, must be ≤ now
git log --format=%aI | tail -1   # oldest commit, must be ≥ planned earliest

# 6. Sample mtime spot-check
#    Pick a few files from the oldest commit and confirm mtimes match the dates Phase 2.5 assigned.
oldest_sha=$(git log --format=%H | tail -1)
git show --name-only --format= "$oldest_sha" | head -3 | xargs ls -la
```

### Optional: per-commit build check

If the user wants the full self-contained guarantee verified, walk the history and build at each commit:

```bash
git rev-list --reverse HEAD | while read sha; do
  git checkout "$sha"
  <build command> || { echo "FAIL at $sha"; break; }
done
git checkout clean-history
```

This is slow (N commits × build time). Only run on user opt-in.

## Phase 6 - Finalize (manual, no automation)

Print the rename commands but do not run them. The user runs these manually after they've inspected the new branch:

```bash
# Rename the original branch out of the way
git branch -m <base> <base>-replaced-<ts>

# Promote the new branch
git branch -m clean-history <base>     # or clean-history-partial → <base>

# Optional: keep the archive tag forever, or delete after a grace period
# git tag -d <base>-archive-<ts>

# To publish (DESTRUCTIVE - overwrites remote):
# git push --force-with-lease origin <base>
```

**Never run `git push --force` or rename the default branch from inside the command.** Both have collaborator-visible blast radius and require human eyes on the result.

## Notes

- **No co-author attribution.**
- **Knowledge capture**: after a successful run, suggest the user run `/save` to record the commit plan as a `decision` scoped to the repo, especially the cycle-breaking and ownership tie-break choices - those will recur if the command is run again.
- **Repeatability**: each rerun of `/clean-history` against the same repo should produce a similar plan. Discovery is deterministic; topo-sort is stable when given a stable tie-break (alphabetical by module name). The migration consolidation will only get more aggressive over time as more FIXUPs accumulate - the whole point of running this periodically.
- **Timezone**: all Phase 2.5 timestamps use the local timezone of the machine running the script. Reruns on a different machine produce different offsets. If reproducibility across machines matters, set `TZ` explicitly before running.
- **Jitter is fresh per run**: rerunning produces different exact times even with the same plan. Commit *order* and the *day* a commit lands on are stable across reruns; the minute-level placement is not.
- **Push behavior with new dates**: forcing `<base>` after this command rewrites collaborators' refs with new author/committer dates. Per Phase 6, only the user runs the rename/push.

## Failure modes to watch for

- **Cycles in the import graph**: not solvable by the command. Report and stop at GATE 2.
- **Generated code that depends on hand-written code that depends on generated code**: usually means the generator config lives in the repo. Commit the generator config in scaffold, the schema source in schema-defs, then the generated code in schema-gen.
- **Files that exist on `<base>` but aren't in any phase's path filter**: surface in GATE 2 as "unassigned". Do not silently drop. Either add a phase or ask the user where they belong.
- **Migration consolidation produces an FK cycle**: real schema bug. Report and stop at GATE 3.
- **`git diff <archive> HEAD` is non-empty after Phase 5**: the slicing or extraction is wrong. Report the diff, leave everything for inspection.
