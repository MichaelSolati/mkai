---
name: seo-auditor
description: |
  Scan and optimize documentation files for SEO. Audits README.md files and docs/ pages for
  meta tags, headings, keywords, readability, duplicate content, and broken links. Applies
  fixes, updates sitemap.xml, and generates a report. Usage: /seo-auditor [path]
---

# /seo-auditor

Systematically scan, audit, and optimize documentation files for SEO. Targets README.md files and docs/ pages - fixes issues in place, preserves rankings on high-performing pages, and generates a final report.

## Usage

```bash
/seo-auditor                    # Audit all docs/ and root README.md
/seo-auditor docs/skills/       # Audit a specific docs subdirectory
/seo-auditor --report-only      # Scan without making changes
```

## What It Does

Execute all 7 phases sequentially. Auto-fix non-destructive issues. Preserve existing high-ranking content. Report everything at the end.

---

## Phase 1: Discovery & Baseline

### 1a. Identify target files

Scan for documentation files that need SEO audit:

```bash
# Find all markdown files in docs/ and root README files
find docs/ -name '*.md' -type f | sort
find . -maxdepth 2 -name 'README.md' -not -path './.codex/*' -not -path './.gemini/*' | sort
```

Classify each file:
- **New/recently modified** - files changed in the last 2 commits (check via `git log`)
- **Index pages** - `index.md` files (high authority, handle with care)
- **Skill pages** - `docs/skills/**/*.md` (auto-generated documentation pages)
- **Static pages** - `docs/index.md`, `docs/getting-started.md`, `docs/integrations.md`, etc.
- **README files** - root and domain-level README.md

### 1b. Capture baseline

For each target file, extract current SEO state:
- `title:` frontmatter field → becomes `<title>` tag
- `description:` frontmatter field → becomes `<meta name="description">`
- First `# H1` heading
- All `## H2` and `### H3` subheadings
- Word count
- Internal link count
- External link count

Store baseline in memory for the report.

---

## Phase 2: Meta Tag Audit

For every file with YAML frontmatter, check and fix:

### Title Tag (`title:`)

**Rules:**
- Must exist and be non-empty
- Length: 50-60 characters ideal (Google truncates at ~60)
- Must contain a primary keyword
- Must NOT duplicate another page's title
- For skill pages: should follow the pattern `{Skill Name} - {Differentiator} - {site_name}`
- site_name from `mkdocs.yml` is appended automatically - don't duplicate it in the title

**Auto-fix:** If title is generic (e.g., just the skill name), enrich it with domain context. Use the pattern `{Skill Name} - {Differentiator}` to make titles unique and keyword-rich.

### Meta Description (`description:`)

**Rules:**
- Must exist and be non-empty
- Length: 120-160 characters (Google truncates at ~160)
- Must contain the primary keyword naturally
- Must be unique across all pages - no two pages share the same description
- Should include a call-to-action or value proposition
- Must NOT start with "This page..." or "This document..."

**Auto-fix:** If description is missing or generic, generate one from the SKILL.md frontmatter `description` field (if available) or from the first paragraph of content. Ensure it is 120-160 characters and contains the primary keyword.

### Validation

For each file that has HTML output in `site/`, manually check:
- Title tag is present and within 50-60 characters
- Meta description is present and within 120-160 characters
- No duplicate titles or descriptions across the site
- Primary keyword appears in both title and description

Flag any page with missing or duplicate meta tags as a priority fix.

---

## Phase 3: Content Quality & Readability

For each target file, analyze and improve:

### Heading Structure

**Rules:**
- Exactly one `# H1` per page
- H2s follow H1, H3s follow H2 - no skipping levels
- Headings should contain keywords naturally (not stuffed)
- No duplicate headings on the same page

**Auto-fix:** If heading levels skip (H1 → H3), adjust to proper hierarchy.

### Readability

Analyze each file for readability, structure, and engagement:

- **Readability** - assess sentence complexity, jargon density, and paragraph length. Aim for clear, accessible prose.
- **Structure** - check heading hierarchy, use of lists, and logical flow. Every section should have a clear purpose.
- **Engagement** - evaluate whether content uses actionable language, examples, and addresses the reader directly.

### Content Quality Rules

- **Paragraphs:** No single paragraph longer than 5 sentences
- **Sentences:** Average sentence length 15-20 words
- **Passive voice:** Less than 15% of sentences
- **Transition words:** At least 30% of sentences use transitions
- **Bullet lists:** Use lists for 3+ items instead of comma-separated inline lists

### AI Content Detection

Review non-generated content (README.md files, static pages) for AI-sounding patterns. Flag pages that feel generic or formulaic. Apply these voice techniques to humanize content:
- Replace AI cliches ("delve into", "leverage", "it's important to note", "in today's landscape")
- Vary sentence length - mix short punchy sentences with longer explanatory ones
- Add specific examples instead of generic statements
- Use active voice
- Include concrete numbers, dates, or references where possible

**Important:** Only modify content that was recently created or updated. Do NOT rewrite pages that are ranking well - preserve their content.

---

## Phase 4: Keyword Optimization

### 4a. Identify target keywords per page

Based on the page's purpose and domain:

| Page Type | Primary Keywords | Secondary Keywords |
|-----------|-----------------|-------------------|
| Homepage (docs/index.md) | "Claude Code Skills", "agent plugins" | "Codex skills", "Gemini CLI", "OpenClaw" |
| Skill pages | Skill name + "Claude Code" | "agent skill", "Codex plugin", domain terms |
| Agent pages | Agent name + "AI coding agent" | "Claude Code", "orchestrator" |
| Command pages | Command name + "slash command" | "Claude Code", "AI coding" |
| Getting started | "install Claude Code skills" | platform names |
| Domain index | Domain + "skills" + "plugins" | "Claude Code", platform names |

### 4b. Keyword placement checks

For each page, verify the primary keyword appears in:
- [ ] Title tag (frontmatter `title:`)
- [ ] Meta description (frontmatter `description:`)
- [ ] H1 heading
- [ ] First paragraph (within first 100 words)
- [ ] At least one H2 subheading
- [ ] Image alt text (if images present)
- [ ] URL slug (for new pages only - never change existing URLs)

### 4c. Keyword density

- Primary keyword: 1-2% of total word count
- Secondary keywords: 0.5-1% each
- No keyword stuffing - if density exceeds 3%, reduce it

**Important:** Never change URLs of existing pages. URL changes break incoming links and destroy rankings. Only optimize content and meta tags.

---

## Phase 5: Link Audit

### 5a. Internal links

For each target file, check all markdown links `[text](url)`:

- Verify the target exists (file path resolves)
- Check for broken relative links (`../`, `./`)
- Verify anchor links (`#section-name`) point to existing headings

**Auto-fix:** Rewrite broken skill-internal links to valid paths. For skill references that point to source files not served by the docs site, rewrite them as GitHub source URLs (e.g., `https://github.com/{org}/{repo}/blob/main/{path}`).

### 5b. Duplicate content detection

Compare meta descriptions across all pages:

```bash
grep -rh '^description:' docs/**/*.md | sort | uniq -d
```

If duplicates found, make each description unique by adding page-specific context.

Compare H1 headings across all pages - no two pages should have the same H1.

### 5c. Orphan page detection

Check if every page in `docs/` is referenced in `mkdocs.yml` nav. Pages not in nav are orphans - they won't appear in navigation and may not be indexed.

```bash
# Find doc pages not in mkdocs nav
find docs -name '*.md' -not -name 'index.md' | while read f; do
  slug=$(echo "$f" | sed 's|docs/||')
  grep -q "$slug" mkdocs.yml || echo "ORPHAN: $f"
done
```

**Auto-fix:** Add orphan pages to the correct nav section in `mkdocs.yml`.

---

## Phase 6: Sitemap & Build

### 6a. Rebuild the site

```bash
mkdocs build
```

This regenerates `site/sitemap.xml` automatically (MkDocs Material generates it during build).

### 6b. Verify sitemap

Inspect the generated `site/sitemap.xml` and verify:
- All documentation pages appear in the sitemap
- No broken/404 URLs (cross-reference sitemap URLs against actual built files in `site/`)
- URL count matches expected page count from `mkdocs.yml` nav
- Depth distribution is reasonable (no pages deeper than 4 levels)

### 6c. Check for sitemap issues

- **Missing pages:** Pages in `mkdocs.yml` nav that don't appear in sitemap
- **Extra pages:** Pages in sitemap that aren't in nav (orphans)
- **Duplicate URLs:** Same page accessible via multiple URLs

---

## Phase 7: Report

Generate a concise report for the user:

```
╔══════════════════════════════════════════════════════════════╗
║  SEO AUDITOR REPORT                                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Pages scanned:        {n}                                   ║
║  Issues found:         {n}                                   ║
║  Auto-fixed:           {n}                                   ║
║  Manual review needed: {n}                                   ║
║                                                              ║
║  META TAGS                                                   ║
║    Titles optimized:     {n}                                 ║
║    Descriptions fixed:   {n}                                 ║
║    Duplicate titles:     {n} → {n} (fixed)                   ║
║    Duplicate descs:      {n} → {n} (fixed)                   ║
║                                                              ║
║  CONTENT                                                     ║
║    Readability improved: {n} pages                           ║
║    Heading fixes:        {n}                                 ║
║    AI score improved:    {n} pages                           ║
║                                                              ║
║  KEYWORDS                                                    ║
║    Pages missing primary keyword in title: {n}               ║
║    Pages missing keyword in description:   {n}               ║
║    Pages with keyword stuffing:            {n}               ║
║                                                              ║
║  LINKS                                                       ║
║    Broken links found:   {n} → {n} (fixed)                   ║
║    Orphan pages:         {n} → {n} (added to nav)            ║
║    Duplicate content:    {n} → {n} (deduplicated)            ║
║                                                              ║
║  SITEMAP                                                     ║
║    Total URLs:           {n}                                 ║
║    Sitemap regenerated:  ✅                                  ║
║                                                              ║
║  PRESERVED (no changes - ranking well)                       ║
║    {list of pages left untouched}                            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Pages to preserve (do NOT modify)

These pages rank well for their target keywords. Only fix critical issues (broken links, missing meta). Do NOT rewrite content:

- `docs/index.md` - homepage, ranks for "Claude Code Skills"
- `docs/getting-started.md` - installation guide
- `docs/integrations.md` - multi-tool support
- Any page the user explicitly marks as "preserve"

---

## Analysis Capabilities

All SEO analyses described in this command are performed inline by Claude during execution. The key analyses include:

- **SEO scoring** - evaluate HTML pages for meta tags, keyword placement, and structure
- **Content scoring** - assess readability, structure, and engagement quality
- **AI content detection** - identify generic/formulaic writing patterns
- **Headline scoring** - evaluate title quality for CTR and keyword relevance
- **Keyword optimization** - check density, placement, and natural usage
- **Sitemap analysis** - verify structure, completeness, and URL depth
- **Schema validation** - check structured data for correctness
- **Topic clustering** - group pages into logical content clusters for internal linking
