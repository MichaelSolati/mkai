# Frontmatter Schema

Notes created with the `init` command get standardized frontmatter. Identity fields are plain text, allowing you to use names, handles, or emails.

## Core fields (all types)

| Field | Values | Notes |
|-------|--------|-------|
| `title` | string | Note title |
| `type` | `note`, `meeting`, `decision`, `postmortem`, `rfc`, `project`, `runbook`, `daily`, `reference` | Determines type-specific fields below |
| `tags` | list | Tag list |
| `created` | ISO date | Auto-set on init |
| `updated` | ISO date | Auto-bumped by `meta --set` |
| `author` | string | Your name or handle |
| `status` | `draft`, `active`, `review`, `archived` | Lifecycle stage |

## Type-specific fields

### meeting

| Field | Values | Notes |
|-------|--------|-------|
| `participants` | list | Commma-separated list of attendees |
| `date` | ISO date | Auto-set to today |
| `action-items` | list | Starts empty |

### decision

| Field | Values | Notes |
|-------|--------|-------|
| `deciders` | list | Commma-separated list of deciders |
| `decision-date` | ISO date | Auto-set to today |
| `outcome` | `proposed`, `approved`, `rejected`, `superseded` | `--outcome` flag, defaults to `proposed` |

### project

| Field | Values | Notes |
|-------|--------|-------|
| `owner` | string | Main contact for the project |
| `priority` | `low`, `medium`, `high`, `critical` | `--priority` flag |
| `due` | ISO date | `--due YYYY-MM-DD` |

### runbook

| Field | Values | Notes |
|-------|--------|-------|
| `service` | string | Name of the service/app |
| `last-verified` | ISO date | Auto-set to today |

## Templates

Some types pre-seed the note body with a structured template on `init`:

- **postmortem**: Timeline / Impact / Root Cause / Action Items
- **rfc**: Summary / Motivation / Design / Alternatives
- **decision**: Context / Options / Decision / Consequences

## Identity Integration

The `author` and `owner` fields are intended to be consistent with the persona defined in your `identity/me.md` file. Agents will use that context to auto-fill these fields when capturing knowledge on your behalf.
