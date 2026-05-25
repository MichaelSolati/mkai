---
name: client-memory
description: Persistent client context management - defines the ./clients/ directory structure, freshness rules, and output formatting standards used by all real-estate skills
user-invocable: false
---

# Client Memory System

This skill defines the shared conventions used by all real-estate skills for client data persistence and output formatting.

## Client Directory Structure

All client data lives in `./clients/` relative to the working directory:

```
./clients/
├── pipeline.md              # Master lead pipeline
├── learnings.md             # Accumulated market insights
├── cyclsales-config.md      # CRM integration settings
├── content-calendar.md      # Content scheduling
├── market-reports/          # Per-ZIP dated market reports
├── neighborhoods/           # Per-neighborhood analysis
├── market-profiles/
│   └── {zip}.md            # Per-ZIP market analysis
├── sphere/
│   └── contacts.md         # Sphere of influence contacts
└── {client-slug}/
    ├── profile.md          # Client preferences, timeline, budget
    ├── lead-recon.md       # Lead research findings
    ├── comp-analysis.md    # Comparable properties analysis
    ├── listings/           # Saved listing evaluations
    └── communications/     # Email/message drafts
```

## Freshness Rules

- Market data: refresh if older than 7 days
- Client profile: refresh if older than 30 days
- Comp analysis: refresh if older than 14 days
- Lead recon: refresh if older than 7 days

Before using cached data, check the last-modified date. If stale, inform the user and offer to refresh.

## File Naming Conventions

- Client slugs: lowercase, hyphenated (e.g., `john-smith`, `the-garcias`)
- Market profiles: by ZIP code (e.g., `90210.md`, `78701.md`)
- Always include a YAML frontmatter block with `updated:` date in each file

## Reading Client Context

Before executing any client-facing skill:
1. Check if `./clients/` exists
2. If a client is specified, read their `./clients/{slug}/profile.md`
3. Note the freshness of all data files
4. Warn if any critical data is stale
