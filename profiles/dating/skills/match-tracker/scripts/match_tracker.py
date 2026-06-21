#!/usr/bin/env python3
"""
match_tracker.py — Agent-facing helper for the match-tracker skill.

Every command emits exactly one JSON object to stdout:
  {"ok": true|false, "command": "...", "data": {...}, "warnings": [...], "errors": [...]}

Logical failures exit 0; only unexpected crashes exit non-zero.
All obsidian operations are delegated to obsidian.py via subprocess.
"""

import argparse
import ast
import json
import os
import re
import subprocess
import sys
import tempfile
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

_SCRIPT_DIR = Path(__file__).resolve().parent
_OBSIDIAN_SCRIPT = Path(
    os.environ.get(
        "OBSIDIAN_SCRIPT",
        str(Path.home() / ".mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py"),
    )
)
_BASE = os.environ.get("MATCH_TRACKER_BASE", "dating")
_CALENDAR_DIR = f"{_BASE}/_calendar"
_META_DIR = f"{_BASE}/_meta"
_MY_PROFILE = f"{_META_DIR}/my-profile.md"
_VOICE_SAMPLES = f"{_META_DIR}/voice-samples.md"
_ANECDOTES = f"{_META_DIR}/anecdotes.md"
_TEMPLATES_DIR = _SCRIPT_DIR.parent / "references"

# ---------------------------------------------------------------------------
# Core obsidian.py subprocess wrapper
# ---------------------------------------------------------------------------

def _obsidian(*args: str, stdin_text: str | None = None, dry_run: bool = False) -> tuple[int, str, str]:
    cmd = ["python3", str(_OBSIDIAN_SCRIPT), *args]
    if dry_run:
        return 0, json.dumps({"dry_run": True, "would_call": cmd, "stdin": stdin_text}), ""
    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            input=stdin_text,
            timeout=20,
        )
        return proc.returncode, proc.stdout, proc.stderr
    except subprocess.TimeoutExpired:
        return 113, "", "obsidian.py timed out after 20s"
    except FileNotFoundError:
        return 111, "", f"obsidian.py not found at {_OBSIDIAN_SCRIPT}"
    except Exception as exc:  # noqa: BLE001
        return 1, "", str(exc)


def _obsidian_read(path: str, *, heading: str | None = None, frontmatter: str | None = None, map_: bool = False, dry_run: bool = False) -> tuple[int, str, str]:
    args = ["read", path]
    if heading:
        args += ["--heading", heading]
    if frontmatter:
        args += ["--frontmatter", frontmatter]
    if map_:
        args.append("--map")
    return _obsidian(*args, dry_run=dry_run)


def _obsidian_write(path: str, content: str, dry_run: bool = False) -> tuple[int, str, str]:
    with tempfile.NamedTemporaryFile(mode="w", suffix=".md", delete=False) as f:
        f.write(content)
        tmp = f.name
    try:
        return _obsidian("write", path, "--file", tmp, dry_run=dry_run)
    finally:
        os.unlink(tmp)


def _obsidian_append(path: str, content: str, dry_run: bool = False) -> tuple[int, str, str]:
    with tempfile.NamedTemporaryFile(mode="w", suffix=".md", delete=False) as f:
        f.write(content)
        tmp = f.name
    try:
        return _obsidian("append", path, "--file", tmp, dry_run=dry_run)
    finally:
        os.unlink(tmp)


def _obsidian_patch(
    path: str,
    content: str,
    target_type: str,
    target: str,
    operation: str = "replace",
    create_if_missing: bool = False,
    dry_run: bool = False,
) -> tuple[int, str, str]:
    with tempfile.NamedTemporaryFile(mode="w", suffix=".md", delete=False) as f:
        f.write(content)
        tmp = f.name
    args = [
        "patch", path, "--file", tmp,
        "--target-type", target_type,
        "--target", target,
        "--operation", operation,
    ]
    if create_if_missing:
        args.append("--create-if-missing")
    try:
        return _obsidian(*args, dry_run=dry_run)
    finally:
        os.unlink(tmp)


def _obsidian_delete(path: str, dry_run: bool = False) -> tuple[int, str, str]:
    return _obsidian("delete", path, dry_run=dry_run)


def _obsidian_list(folder: str, dry_run: bool = False) -> tuple[int, str, str]:
    return _obsidian("list", folder, dry_run=dry_run)


def _obsidian_meta_set(path: str, dry_run: bool = False, **kwargs: str) -> tuple[int, str, str]:
    args = ["meta", path]
    for k, v in kwargs.items():
        args += ["--set", f"{k}={v}"]
    return _obsidian(*args, dry_run=dry_run)


def _obsidian_dql(query: str, dry_run: bool = False) -> tuple[int, str, str]:
    return _obsidian("dql", query, dry_run=dry_run)

# ---------------------------------------------------------------------------
# Response helpers
# ---------------------------------------------------------------------------

def _ok(command: str, data: Any, warnings: list | None = None) -> dict:
    return {"ok": True, "command": command, "data": data, "warnings": warnings or [], "errors": []}


def _err(command: str, code: str, message: str, **extra: Any) -> dict:
    return {"ok": False, "command": command, "data": None, "warnings": [], "errors": [{"code": code, "message": message, **extra}]}


def _emit(result: dict) -> None:
    print(json.dumps(result, indent=2, default=str))

# ---------------------------------------------------------------------------
# Utility helpers
# ---------------------------------------------------------------------------

def _slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def _today() -> str:
    return date.today().isoformat()


def _parse_list_output(raw: str) -> list[str]:
    """Parse obsidian list output into a list of names (files/folders)."""
    items = []
    for line in raw.splitlines():
        line = line.strip()
        if line and not line.startswith("{") and not line.startswith("["):
            # Strip trailing slash (folders) and .md extension (files)
            name = line.rstrip("/")
            if name.endswith(".md"):
                name = name[:-3]
            items.append(name)
    # Also try to parse as JSON dict (obsidian list returns {"files": [...]})
    if not items:
        try:
            parsed = json.loads(raw)
            files = parsed.get("files", [])
            for f in files:
                name = f.strip().rstrip("/")
                if name.endswith(".md"):
                    name = name[:-3]
                items.append(name)
        except (json.JSONDecodeError, AttributeError):
            try:
                parsed = ast.literal_eval(raw)
                files = parsed.get("files", [])
                for f in files:
                    name = f.strip().rstrip("/")
                    if name.endswith(".md"):
                        name = name[:-3]
                    items.append(name)
            except (ValueError, SyntaxError, AttributeError):
                pass
    return [i for i in items if i]


def _parse_frontmatter(content: str) -> dict:
    """Extract YAML frontmatter from a markdown string."""
    content = content.strip()
    # Obsidian.py read prepends a header line — find the first --- delimiter
    start = content.find("---")
    if start == -1:
        return {}
    content = content[start:]
    end = content.find("\n---", 3)
    if end == -1:
        return {}
    fm_block = content[3:end].strip()
    result = {}
    for line in fm_block.splitlines():
        m = re.match(r'^(\w[\w-]*)\s*:\s*(.*)$', line)
        if m:
            k, v = m.group(1), m.group(2).strip().strip('"')
            result[k] = v
    return result


def _obsidian_unreachable_error(command: str) -> dict:
    return _err(
        command,
        "OBSIDIAN_UNREACHABLE",
        "Obsidian REST API not responding. Is Obsidian running with the Local REST API plugin enabled?",
        hint="Run: python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py setup",
    )


def _check_obsidian(command: str) -> dict | None:
    rc, _, stderr = _obsidian("list", _BASE)
    if rc == 111:
        return _obsidian_unreachable_error(command)
    return None


def _read_file(path: str) -> tuple[str | None, str | None]:
    """Return (content, error_message). error_message is None on success."""
    rc, out, err = _obsidian_read(path)
    if rc != 0:
        return None, err or f"Could not read {path}"
    return out, None


def _file_exists(path: str) -> bool:
    rc, _, _ = _obsidian_read(path)
    return rc == 0

# ---------------------------------------------------------------------------
# Slug & match helpers
# ---------------------------------------------------------------------------

def _list_match_slugs() -> list[str]:
    """Return all slugs in the dating/ base that look like match folders."""
    rc, out, _ = _obsidian_list(_BASE)
    if rc != 0:
        return []
    all_items = _parse_list_output(out)
    # Exclude _meta, _calendar, and files
    return [
        item for item in all_items
        if not item.startswith("_") and "/" not in item and "." not in item
    ]


def _resolve_slug(name: str, known_slugs: list[str]) -> list[str]:
    """Return all slugs matching a first-name prefix."""
    first = _slugify(name.split()[0])
    matches = []
    for slug in known_slugs:
        parts = slug.split("-")
        if parts[0] == first:
            matches.append(slug)
    return matches


def _read_conversation_meta(slug: str) -> dict:
    """Read the top metadata lines from conversation.md and return parsed fields."""
    content, err = _read_file(f"{_BASE}/{slug}/conversation.md")
    if err or not content:
        return {}
    meta = {}
    for line in content.splitlines():
        for field in ["Platform", "Matched", "Status"]:
            m = re.search(rf'\*\*{field}:\*\*\s*(.+)', line)
            if m:
                meta[field.lower()] = m.group(1).strip()
    # Find highest exchange number
    exchanges = re.findall(r'^## Exchange (\d+)', content, re.MULTILINE)
    if exchanges:
        meta["last_exchange_n"] = max(int(e) for e in exchanges)
        # Find date of last exchange
        last_n = meta["last_exchange_n"]
        m = re.search(rf'## Exchange {last_n}.*?\n.*?\*\*Read:\*\*\s*(\S+)', content, re.DOTALL)
        if m:
            meta["last_exchange_date"] = m.group(1).strip()
    return meta

# ---------------------------------------------------------------------------
# Calendar helpers
# ---------------------------------------------------------------------------

def _list_calendar_files() -> list[str]:
    """Return all event file slugs under _calendar/."""
    rc, out, _ = _obsidian_list(_CALENDAR_DIR)
    if rc != 0:
        return []
    return _parse_list_output(out)


def _read_event_frontmatter(event_id: str) -> dict | None:
    """Read frontmatter from an event file. event_id is the filename without .md."""
    content, err = _read_file(f"{_CALENDAR_DIR}/{event_id}.md")
    if err:
        return None
    return _parse_frontmatter(content)


def _event_id_for(slug: str, when: str, activity: str | None) -> str:
    """Build a deterministic event ID."""
    parts = [when, slug]
    if activity:
        parts.append(_slugify(activity))
    base = "-".join(parts)
    # Check for collisions
    existing = _list_calendar_files()
    candidate = base
    n = 2
    while candidate in existing:
        candidate = f"{base}-{n}"
        n += 1
    return candidate


def _time_to_minutes(t: str) -> int | None:
    """Convert HH:MM to minutes since midnight. Returns None if unparseable."""
    m = re.match(r'^(\d{1,2}):(\d{2})$', t.strip())
    if not m:
        return None
    return int(m.group(1)) * 60 + int(m.group(2))


def _times_overlap(a_start: str | None, a_end: str | None, b_start: str | None, b_end: str | None, default_duration: int = 120) -> bool:
    """Return True if two time windows overlap."""
    if not a_start or not b_start:
        return False
    a_s = _time_to_minutes(a_start)
    b_s = _time_to_minutes(b_start)
    if a_s is None or b_s is None:
        return False
    a_e = _time_to_minutes(a_end) if a_end else a_s + default_duration
    b_e = _time_to_minutes(b_end) if b_end else b_s + default_duration
    return a_s < b_e and b_s < a_e


def _detect_conflicts(
    target_date: str,
    start: str | None = None,
    end: str | None = None,
    buffer_minutes: int = 0,
    exclude_id: str | None = None,
) -> list[dict]:
    """Return list of conflicting event metadata dicts."""
    conflicts = []
    for event_id in _list_calendar_files():
        if event_id == exclude_id:
            continue
        fm = _read_event_frontmatter(event_id)
        if not fm:
            continue
        if fm.get("date") != target_date:
            continue
        if fm.get("status") in ("cancelled", "completed", "no-show"):
            continue
        conflict_info = {"event_id": event_id, **fm}
        if start:
            # Check time overlap
            ev_start = fm.get("start")
            ev_end = fm.get("end")
            if ev_start:
                # Apply buffer by expanding windows
                buf_start = start
                buf_end = end
                if buffer_minutes:
                    s = _time_to_minutes(start)
                    e = _time_to_minutes(end) if end else (s + 120 if s is not None else None)
                    if s is not None:
                        s_buf = s - buffer_minutes
                        e_buf = (e + buffer_minutes) if e is not None else None
                        buf_start = f"{s_buf // 60:02d}:{s_buf % 60:02d}" if s_buf >= 0 else "00:00"
                        buf_end = f"{e_buf // 60:02d}:{e_buf % 60:02d}" if e_buf is not None else None
                if _times_overlap(buf_start, buf_end, ev_start, ev_end):
                    conflicts.append(conflict_info)
            else:
                # Other event has no start — same-day soft conflict
                conflicts.append(conflict_info)
        else:
            conflicts.append(conflict_info)
    return conflicts


def _event_file_content(
    slug: str,
    display_name: str,
    event_date: str,
    start: str | None,
    end: str | None,
    where: str | None,
    activity: str | None,
    notes: str | None,
    tz_name: str | None,
) -> str:
    lines = ["---"]
    lines.append("type: dating-event")
    lines.append(f"date: {event_date}")
    if start:
        lines.append(f'start: "{start}"')
    if end:
        lines.append(f'end: "{end}"')
    tz_val = tz_name or _system_tz()
    lines.append(f"tz: {tz_val}")
    lines.append(f"match: {slug}")
    lines.append(f'with: "[[{_BASE}/{slug}/profile]]"')
    if where:
        lines.append(f"where: {json.dumps(where)}")
    if activity:
        lines.append(f"activity: {_slugify(activity)}")
    lines.append("status: scheduled")
    lines.append(f"created: {_today()}")
    lines.append(f"updated: {_today()}")
    lines.append("---")
    lines.append("")
    activity_label = activity.capitalize() if activity else "Date"
    where_label = f" at {where}" if where else ""
    lines.append(f"# {display_name} — {activity_label}{where_label}")
    lines.append("")
    lines.append("## Plan")
    if notes:
        lines.append("")
        lines.append(notes)
    lines.append("")
    lines.append("## Outcome")
    lines.append("")
    lines.append("## Reflection")
    lines.append("")
    return "\n".join(lines)


def _system_tz() -> str:
    try:
        return datetime.now(timezone.utc).astimezone().tzname() or "UTC"
    except Exception:  # noqa: BLE001
        return "UTC"


def _update_profile_date_history(slug: str, event_id: str, activity: str | None, status: str, dry_run: bool = False) -> list[str]:
    """Append or refresh the Date History section in a match's profile.md."""
    warnings = []
    profile_path = f"{_BASE}/{slug}/profile.md"
    line = f"- [[{_CALENDAR_DIR}/{event_id}]] — {activity or 'date'}, {status}"
    rc, _, err = _obsidian_patch(
        profile_path,
        line,
        target_type="heading",
        target="Date History",
        operation="append",
        create_if_missing=True,
        dry_run=dry_run,
    )
    if rc != 0:
        warnings.append(f"Could not update Date History in profile: {err}")
    return warnings

# ---------------------------------------------------------------------------
# Anecdote helpers
# ---------------------------------------------------------------------------

def _parse_anecdotes(content: str) -> list[dict]:
    """Parse structured blocks from anecdotes.md."""
    anecdotes = []
    # Split on ### a-YYYY-NNN headers
    blocks = re.split(r'\n(?=### a-\d{4}-\d+)', content)
    for block in blocks:
        m = re.match(r'^### (a-\d{4}-\d+)\s*\n', block)
        if not m:
            continue
        anecdote_id = m.group(1)
        fields = {}
        for field in ["Title", "Tags", "Length", "Hook works for", "Last used", "Used with"]:
            fm = re.search(rf'\*\*{re.escape(field)}:\*\*\s*(.+)', block)
            if fm:
                fields[field.lower().replace(" ", "_")] = fm.group(1).strip()
        # Summary: text after the bold-key block and before the next ---
        summary_match = re.search(r'\*\*Used with:\*\*.*?\n\n(.*?)(?:\n---|\Z)', block, re.DOTALL)
        summary = summary_match.group(1).strip() if summary_match else ""
        tags = [t.strip() for t in fields.get("tags", "").split(",") if t.strip()]
        used_with = [u.strip() for u in fields.get("used_with", "").split(",") if u.strip()]
        anecdotes.append({
            "id": anecdote_id,
            "title": fields.get("title", ""),
            "tags": tags,
            "length": fields.get("length", ""),
            "hook_works_for": fields.get("hook_works_for", ""),
            "last_used": fields.get("last_used", ""),
            "used_with": used_with,
            "summary": summary,
        })
    return anecdotes


def _next_anecdote_id(existing: list[dict]) -> str:
    year = date.today().year
    max_n = 0
    for a in existing:
        m = re.match(rf'^a-{year}-(\d+)$', a["id"])
        if m:
            max_n = max(max_n, int(m.group(1)))
    return f"a-{year}-{max_n + 1:03d}"


def _anecdote_block(anecdote_id: str, title: str, tags: list[str], length: str, hook: str, summary: str) -> str:
    lines = [
        f"### {anecdote_id}",
        f"**Title:** {title}",
        f"**Tags:** {', '.join(tags) if tags else ''}",
        f"**Length:** {length or 'short'}",
        f"**Hook works for:** {hook or ''}",
        f"**Last used:**",
        f"**Used with:**",
        "",
        summary,
        "",
        "---",
        "",
    ]
    return "\n".join(lines)


def _ensure_anecdotes_file(dry_run: bool = False) -> list[str]:
    """Create anecdotes.md if it doesn't exist."""
    warnings = []
    if not _file_exists(_ANECDOTES):
        header = "\n".join([
            "---",
            "type: anecdote-collection",
            f"updated: {_today()}",
            "---",
            "",
            "# Anecdotes & Stories",
            "",
        ])
        rc, _, err = _obsidian_write(_ANECDOTES, header, dry_run=dry_run)
        if rc != 0:
            warnings.append(f"Could not create anecdotes file: {err}")
    return warnings

# ---------------------------------------------------------------------------
# Capture routing
# ---------------------------------------------------------------------------

_CAPTURE_ROUTES: dict[str, tuple[str, str | None, str]] = {
    "like":         (_MY_PROFILE, "Likes",                  "append"),
    "dislike":      (_MY_PROFILE, "Dislikes",                "append"),
    "preference":   (_MY_PROFILE, "Preferences",             "append"),
    "dealbreaker":  (_MY_PROFILE, "Dealbreakers & Friction", "append"),
    "date-idea":    (_MY_PROFILE, "Date Repertoire",         "append"),
    "voice-anchor": (_MY_PROFILE, "Voice Anchors",           "append"),
    "fact":         (_MY_PROFILE, "Quick Facts",             "replace"),
    "note":         (_MY_PROFILE, "Notes",                   "append"),
    "anecdote":     (_ANECDOTES,  None,                      "block-append"),
}

# ---------------------------------------------------------------------------
# Command implementations
# ---------------------------------------------------------------------------

# --- Match operations ---

def cmd_list_matches(args: argparse.Namespace) -> dict:
    cmd = "list-matches"
    err = _check_obsidian(cmd)
    if err:
        return err

    slugs = _list_match_slugs()
    matches = []
    warnings = []

    for slug in slugs:
        meta = _read_conversation_meta(slug)
        if not meta and args.status not in (None, "all"):
            continue
        status = meta.get("status", "Active")
        if args.status and args.status != "all" and status.lower() != args.status.lower():
            continue

        # Look for next upcoming event
        next_event = None
        today = _today()
        for event_id in sorted(_list_calendar_files()):
            fm = _read_event_frontmatter(event_id)
            if fm and fm.get("match") == slug and fm.get("date", "") >= today and fm.get("status") not in ("cancelled", "completed", "no-show"):
                next_event = {"event_id": event_id, "date": fm.get("date"), "where": fm.get("where"), "activity": fm.get("activity"), "status": fm.get("status")}
                break

        matches.append({
            "slug": slug,
            "platform": meta.get("platform", ""),
            "matched_date": meta.get("matched", ""),
            "status": status,
            "last_exchange_n": meta.get("last_exchange_n"),
            "last_exchange_date": meta.get("last_exchange_date", ""),
            "next_event": next_event,
        })

    return _ok(cmd, {"matches": matches})


def cmd_match_summary(args: argparse.Namespace) -> dict:
    cmd = "match-summary"
    slug = _slugify(args.slug)
    err = _check_obsidian(cmd)
    if err:
        return err

    profile_content, perr = _read_file(f"{_BASE}/{slug}/profile.md")
    if perr:
        return _err(cmd, "NOT_FOUND", f"No match found with slug '{slug}'. Run list-matches to see available matches.", slug=slug)

    conv_content = None
    if args.include_conversation:
        conv_content, _ = _read_file(f"{_BASE}/{slug}/conversation.md")

    meta = _read_conversation_meta(slug)

    # Upcoming events for this match
    today = _today()
    upcoming = []
    past = []
    for event_id in sorted(_list_calendar_files()):
        fm = _read_event_frontmatter(event_id)
        if fm and fm.get("match") == slug:
            event_info = {"event_id": event_id, **{k: v for k, v in fm.items()}}
            if fm.get("date", "") >= today and fm.get("status") not in ("cancelled", "completed", "no-show"):
                upcoming.append(event_info)
            else:
                past.append(event_info)

    next_event = upcoming[0] if upcoming else None

    return _ok(cmd, {
        "slug": slug,
        "meta": meta,
        "profile": profile_content,
        "conversation": conv_content,
        "next_event": next_event,
        "upcoming_events": upcoming,
        "past_events": past[-5:],  # last 5
    })


def cmd_new_match(args: argparse.Namespace) -> dict:
    cmd = "new-match"
    err = _check_obsidian(cmd)
    if err:
        return err

    name = args.name.strip()
    slug_base = _slugify(name)
    warnings = []

    # Read profile content
    profile_content = None
    if args.profile_file:
        try:
            profile_content = Path(args.profile_file).read_text()
        except OSError as e:
            return _err(cmd, "FILE_READ_ERROR", str(e))

    # Check for existing slugs that could collide
    existing = _list_match_slugs()
    collisions = _resolve_slug(name, existing)
    if collisions:
        return _err(
            cmd,
            "COLLISION",
            f"A match named '{collisions[0]}' already exists. Disambiguate first using the disambiguate command.",
            existing_slugs=collisions,
            suggested_disambiguators=["last-initial", "platform", "ordinal"],
        )

    slug = slug_base
    profile_path = f"{_BASE}/{slug}/profile.md"
    conversation_path = f"{_BASE}/{slug}/conversation.md"

    # Build profile.md
    if not profile_content:
        try:
            template = (_TEMPLATES_DIR / "profile-template.md").read_text()
            profile_content = template.replace("{{Name}}", name)
        except OSError:
            profile_content = f"# {name}\n\n## Quick Facts\n\n## Notes & Observations\n\n## Compatibility Signals\n\n## Potential Friction\n\n## Date History\n"

    # Ensure Date History section exists
    if "## Date History" not in profile_content:
        profile_content = profile_content.rstrip() + "\n\n## Date History\n\n<!-- Auto-maintained by match-tracker. -->\n"

    rc, _, e = _obsidian_write(profile_path, profile_content)
    if rc != 0:
        return _err(cmd, "WRITE_FAILED", f"Could not write profile: {e}")

    # Build conversation.md
    what_caught_eye = args.what_caught_eye or ""
    try:
        conv_template = (_TEMPLATES_DIR / "conversation-template.md").read_text()
        conv_content = conv_template.replace("{{Name}}", name)
        if args.platform:
            conv_content = re.sub(r'\{\{Hinge.*?\}\}', args.platform, conv_content)
        if args.matched:
            conv_content = conv_content.replace("{{YYYY-MM-DD}}", args.matched)
        if what_caught_eye:
            conv_content = re.sub(
                r'\[What about her.*?\]', what_caught_eye, conv_content
            )
    except OSError:
        conv_content = f"# {name} - Conversation Log\n\n**Platform:** {args.platform or ''}\n**Matched:** {args.matched or _today()}\n**Status:** Active\n\n---\n\n## Pre-Match Strategy\n\n**What caught your eye:** {what_caught_eye}\n"

    rc, _, e = _obsidian_write(conversation_path, conv_content)
    if rc != 0:
        return _err(cmd, "WRITE_FAILED", f"Could not write conversation: {e}")

    return _ok(cmd, {
        "slug": slug,
        "name": name,
        "profile_path": profile_path,
        "conversation_path": conversation_path,
        "collisions_resolved": [],
    }, warnings)


def cmd_log_exchange(args: argparse.Namespace) -> dict:
    cmd = "log-exchange"
    slug = _slugify(args.slug)
    err = _check_obsidian(cmd)
    if err:
        return err

    content, cerr = _read_file(f"{_BASE}/{slug}/conversation.md")
    if cerr:
        return _err(cmd, "NOT_FOUND", f"No conversation found for '{slug}'")

    exchanges = re.findall(r'^## Exchange (\d+)', content, re.MULTILINE)
    next_n = (max(int(e) for e in exchanges) + 1) if exchanges else 1

    her_text = args.her or ""
    if args.her_file:
        try:
            her_text = Path(args.her_file).read_text()
        except OSError as e:
            return _err(cmd, "FILE_READ_ERROR", str(e))

    read_date = args.read or _today()
    block = f"\n## Exchange {next_n}\n\n**Her response:**\n> {her_text}\n\n**Read:** {read_date}\n"

    rc, _, e = _obsidian_append(f"{_BASE}/{slug}/conversation.md", block)
    if rc != 0:
        return _err(cmd, "WRITE_FAILED", f"Could not append exchange: {e}")

    return _ok(cmd, {"slug": slug, "exchange_n": next_n, "conversation_path": f"{_BASE}/{slug}/conversation.md"})


def cmd_log_reply(args: argparse.Namespace) -> dict:
    cmd = "log-reply"
    slug = _slugify(args.slug)
    err = _check_obsidian(cmd)
    if err:
        return err

    my_text = args.my or ""
    if args.my_file:
        try:
            my_text = Path(args.my_file).read_text()
        except OSError as e:
            return _err(cmd, "FILE_READ_ERROR", str(e))

    content, cerr = _read_file(f"{_BASE}/{slug}/conversation.md")
    if cerr:
        return _err(cmd, "NOT_FOUND", f"No conversation found for '{slug}'")

    exchanges = re.findall(r'^## Exchange (\d+)', content, re.MULTILINE)
    current_n = max(int(e) for e in exchanges) if exchanges else 0

    sent_date = args.sent or _today()
    block = f"\n## My Reply ({sent_date})\n\n{my_text}\n"

    rc, _, e = _obsidian_append(f"{_BASE}/{slug}/conversation.md", block)
    if rc != 0:
        return _err(cmd, "WRITE_FAILED", f"Could not append reply: {e}")

    return _ok(cmd, {"slug": slug, "exchange_n": current_n, "conversation_path": f"{_BASE}/{slug}/conversation.md"})


def cmd_update_match(args: argparse.Namespace) -> dict:
    cmd = "update-match"
    slug = _slugify(args.slug)
    err = _check_obsidian(cmd)
    if err:
        return err

    profile_path = f"{_BASE}/{slug}/profile.md"
    if not _file_exists(profile_path):
        return _err(cmd, "NOT_FOUND", f"No profile found for '{slug}'")

    content = args.content or ""
    if args.file:
        try:
            content = Path(args.file).read_text()
        except OSError as e:
            return _err(cmd, "FILE_READ_ERROR", str(e))

    operation = args.operation or "append"
    rc, _, e = _obsidian_patch(
        profile_path, content,
        target_type="heading", target=args.section,
        operation=operation, create_if_missing=True,
    )
    if rc != 0:
        return _err(cmd, "PATCH_FAILED", f"Could not update section '{args.section}': {e}")

    return _ok(cmd, {"slug": slug, "section": args.section, "operation": operation})


def cmd_disambiguate(args: argparse.Namespace) -> dict:
    cmd = "disambiguate"
    old_slug = _slugify(args.old_slug)
    new_slug = _slugify(args.to)
    err = _check_obsidian(cmd)
    if err:
        return err

    warnings = []
    files_moved = []

    # Move match files
    for filename in ["profile.md", "conversation.md"]:
        old_path = f"{_BASE}/{old_slug}/{filename}"
        new_path = f"{_BASE}/{new_slug}/{filename}"
        content, rerr = _read_file(old_path)
        if rerr:
            warnings.append(f"Could not read {old_path}: {rerr}")
            continue
        rc, _, e = _obsidian_write(new_path, content)
        if rc != 0:
            return _err(cmd, "WRITE_FAILED", f"Could not write {new_path}: {e}")
        # Verify
        if not _file_exists(new_path):
            return _err(cmd, "VERIFY_FAILED", f"File not found after write: {new_path}")
        rc, _, e = _obsidian_delete(old_path)
        if rc != 0:
            warnings.append(f"Could not delete {old_path}: {e}")
        files_moved.append({"from": old_path, "to": new_path})

    # Rewrite calendar events that reference old_slug
    events_updated = []
    for event_id in _list_calendar_files():
        fm = _read_event_frontmatter(event_id)
        if not fm or fm.get("match") != old_slug:
            continue
        event_path = f"{_CALENDAR_DIR}/{event_id}.md"
        content, rerr = _read_file(event_path)
        if rerr:
            warnings.append(f"Could not read event {event_id}: {rerr}")
            continue
        new_content = content.replace(f"match: {old_slug}", f"match: {new_slug}")
        new_content = new_content.replace(
            f'"[[{_BASE}/{old_slug}/profile]]"',
            f'"[[{_BASE}/{new_slug}/profile]]"',
        )
        new_content = re.sub(r'updated: \S+', f"updated: {_today()}", new_content)
        rc, _, e = _obsidian_write(event_path, new_content)
        if rc != 0:
            warnings.append(f"Could not update event {event_id}: {e}")
        else:
            events_updated.append(event_id)

    return _ok(cmd, {
        "from": old_slug,
        "to": new_slug,
        "files_moved": files_moved,
        "events_updated": events_updated,
    }, warnings)


# --- Calendar operations ---

def cmd_schedule(args: argparse.Namespace) -> dict:
    cmd = "schedule"
    slug = _slugify(args.match_slug)
    err = _check_obsidian(cmd)
    if err:
        return err

    # Validate match exists
    if not _file_exists(f"{_BASE}/{slug}/profile.md"):
        return _err(cmd, "NOT_FOUND", f"No match found with slug '{slug}'. Create them first with new-match.")

    # Get display name from profile
    content, _ = _read_file(f"{_BASE}/{slug}/profile.md")
    display_name_match = re.search(r'^# (.+)$', content or "", re.MULTILINE)
    display_name = display_name_match.group(1).strip() if display_name_match else slug.replace("-", " ").title()

    # Check conflicts
    conflicts = _detect_conflicts(
        args.date,
        start=args.start,
        end=args.end,
        buffer_minutes=args.buffer_minutes or 0,
    )

    notes = args.notes or ""
    if args.notes_file:
        try:
            notes = Path(args.notes_file).read_text()
        except OSError as e:
            return _err(cmd, "FILE_READ_ERROR", str(e))

    # If conflicts, return them and require --force to proceed
    if conflicts and not args.force:
        return _ok(cmd, {
            "event_id": None,
            "path": None,
            "conflicts": conflicts,
            "match_link": f"[[{_BASE}/{slug}/profile]]",
            "message": f"Found {len(conflicts)} conflict(s) on {args.date}. Re-run with --force to schedule anyway, or pick a different time.",
        })

    event_id = _event_id_for(slug, args.date, args.activity)
    event_path = f"{_CALENDAR_DIR}/{event_id}.md"
    event_content = _event_file_content(
        slug=slug,
        display_name=display_name,
        event_date=args.date,
        start=args.start,
        end=args.end,
        where=args.where,
        activity=args.activity,
        notes=notes,
        tz_name=args.tz,
    )

    rc, _, e = _obsidian_write(event_path, event_content)
    if rc != 0:
        return _err(cmd, "WRITE_FAILED", f"Could not create event: {e}")

    # Update Date History in the match's profile
    w = _update_profile_date_history(slug, event_id, args.activity, "scheduled")

    return _ok(cmd, {
        "event_id": event_id,
        "path": event_path,
        "date": args.date,
        "start": args.start,
        "where": args.where,
        "activity": args.activity,
        "match": slug,
        "match_link": f"[[{_BASE}/{slug}/profile]]",
        "conflicts": conflicts,
    }, w)


def cmd_list_events(args: argparse.Namespace) -> dict:
    cmd = "list-events"
    err = _check_obsidian(cmd)
    if err:
        return err

    today = _today()
    from_date = args.from_date or (today if args.upcoming else None)
    to_date = args.to_date

    events = []
    warnings = []

    for event_id in sorted(_list_calendar_files()):
        fm = _read_event_frontmatter(event_id)
        if fm is None:
            warnings.append(f"Could not parse frontmatter for {event_id}")
            continue

        event_date = fm.get("date", "")
        status = fm.get("status", "")

        # Filter by date range
        if from_date and event_date < from_date:
            continue
        if to_date and event_date > to_date:
            continue

        # Filter by upcoming (non-terminal statuses)
        if args.upcoming and status in ("cancelled", "completed", "no-show"):
            continue

        # Filter by match
        if args.with_match and fm.get("match") != _slugify(args.with_match):
            continue

        # Filter by status
        if args.status and status != args.status:
            continue

        events.append({
            "event_id": event_id,
            "path": f"{_CALENDAR_DIR}/{event_id}.md",
            "date": event_date,
            "start": fm.get("start"),
            "end": fm.get("end"),
            "where": fm.get("where"),
            "activity": fm.get("activity"),
            "match": fm.get("match"),
            "status": status,
        })

    return _ok(cmd, {"events": events, "count": len(events)}, warnings)


def cmd_check_conflict(args: argparse.Namespace) -> dict:
    cmd = "check-conflict"
    err = _check_obsidian(cmd)
    if err:
        return err

    conflicts = _detect_conflicts(
        args.date,
        start=args.start,
        end=args.end,
        buffer_minutes=args.buffer_minutes or 0,
        exclude_id=args.exclude,
    )

    same_day = [c for c in conflicts]
    time_overlaps = [c for c in conflicts if c.get("start")]

    return _ok(cmd, {
        "has_conflict": len(conflicts) > 0,
        "conflict_count": len(conflicts),
        "same_day": same_day,
        "time_overlaps": time_overlaps,
        "date": args.date,
    })


def cmd_event_summary(args: argparse.Namespace) -> dict:
    cmd = "event-summary"
    event_id = args.event_id
    content, rerr = _read_file(f"{_CALENDAR_DIR}/{event_id}.md")
    if rerr:
        return _err(cmd, "NOT_FOUND", f"Event '{event_id}' not found")

    fm = _parse_frontmatter(content)
    # Extract body sections
    sections: dict[str, str] = {}
    current_heading = None
    current_lines: list[str] = []
    for line in content.splitlines():
        if line.startswith("## "):
            if current_heading:
                sections[current_heading] = "\n".join(current_lines).strip()
            current_heading = line[3:].strip()
            current_lines = []
        elif current_heading:
            current_lines.append(line)
    if current_heading:
        sections[current_heading] = "\n".join(current_lines).strip()

    return _ok(cmd, {"event_id": event_id, "frontmatter": fm, "body_sections": sections})


def cmd_update_event(args: argparse.Namespace) -> dict:
    cmd = "update-event"
    event_id = args.event_id
    err = _check_obsidian(cmd)
    if err:
        return err

    event_path = f"{_CALENDAR_DIR}/{event_id}.md"
    content, rerr = _read_file(event_path)
    if rerr:
        return _err(cmd, "NOT_FOUND", f"Event '{event_id}' not found")

    warnings = []
    changes: dict[str, str] = {}

    # Apply frontmatter changes
    if args.event_date:
        content = re.sub(r'^date: .+$', f"date: {args.event_date}", content, flags=re.MULTILINE)
        changes["date"] = args.event_date
    if args.start:
        if re.search(r'^start:', content, re.MULTILINE):
            content = re.sub(r'^start: ".+"$', f'start: "{args.start}"', content, flags=re.MULTILINE)
        else:
            content = content.replace("match:", f'start: "{args.start}"\nmatch:')
        changes["start"] = args.start
    if args.where:
        if re.search(r'^where:', content, re.MULTILINE):
            content = re.sub(r'^where: .+$', f"where: {json.dumps(args.where)}", content, flags=re.MULTILINE)
        else:
            content = content.replace("activity:", f"where: {json.dumps(args.where)}\nactivity:")
        changes["where"] = args.where
    if args.status:
        content = re.sub(r'^status: .+$', f"status: {args.status}", content, flags=re.MULTILINE)
        changes["status"] = args.status

    content = re.sub(r'^updated: .+$', f"updated: {_today()}", content, flags=re.MULTILINE)

    rc, _, e = _obsidian_write(event_path, content)
    if rc != 0:
        return _err(cmd, "WRITE_FAILED", f"Could not update event: {e}")

    # Update outcome section if provided
    if args.outcome_file:
        try:
            outcome = Path(args.outcome_file).read_text()
            rc2, _, e2 = _obsidian_patch(event_path, outcome, "heading", "Outcome", "replace", create_if_missing=True)
            if rc2 != 0:
                warnings.append(f"Could not update Outcome section: {e2}")
        except OSError as e:
            warnings.append(f"Could not read outcome file: {e}")

    # Detect new conflicts if date changed
    conflicts = []
    fm = _parse_frontmatter(content)
    if args.event_date or args.start:
        conflicts = _detect_conflicts(
            fm.get("date", ""),
            start=fm.get("start"),
            end=fm.get("end"),
            exclude_id=event_id,
        )

    return _ok(cmd, {"event_id": event_id, "changes": changes, "conflicts": conflicts}, warnings)


def cmd_cancel_event(args: argparse.Namespace) -> dict:
    cmd = "cancel-event"
    event_id = args.event_id
    err = _check_obsidian(cmd)
    if err:
        return err

    event_path = f"{_CALENDAR_DIR}/{event_id}.md"
    content, rerr = _read_file(event_path)
    if rerr:
        return _err(cmd, "NOT_FOUND", f"Event '{event_id}' not found")

    content = re.sub(r'^status: .+$', "status: cancelled", content, flags=re.MULTILINE)
    content = re.sub(r'^updated: .+$', f"updated: {_today()}", content, flags=re.MULTILINE)

    if args.reason:
        reason_block = f"\n**Cancelled:** {_today()}\n**Reason:** {args.reason}\n"
        content = content.rstrip() + reason_block

    rc, _, e = _obsidian_write(event_path, content)
    if rc != 0:
        return _err(cmd, "WRITE_FAILED", f"Could not cancel event: {e}")

    return _ok(cmd, {"event_id": event_id, "status": "cancelled"})


def cmd_complete_event(args: argparse.Namespace) -> dict:
    cmd = "complete-event"
    event_id = args.event_id
    err = _check_obsidian(cmd)
    if err:
        return err

    event_path = f"{_CALENDAR_DIR}/{event_id}.md"
    content, rerr = _read_file(event_path)
    if rerr:
        return _err(cmd, "NOT_FOUND", f"Event '{event_id}' not found")

    warnings = []
    content = re.sub(r'^status: .+$', "status: completed", content, flags=re.MULTILINE)
    content = re.sub(r'^updated: .+$', f"updated: {_today()}", content, flags=re.MULTILINE)

    rc, _, e = _obsidian_write(event_path, content)
    if rc != 0:
        return _err(cmd, "WRITE_FAILED", f"Could not update event status: {e}")

    if args.outcome_file:
        try:
            outcome = Path(args.outcome_file).read_text()
            rc2, _, e2 = _obsidian_patch(event_path, outcome, "heading", "Outcome", "replace", create_if_missing=True)
            if rc2 != 0:
                warnings.append(f"Could not update Outcome section: {e2}")
        except OSError as e:
            warnings.append(f"Could not read outcome file: {e}")

    if args.reflection_file:
        try:
            reflection = Path(args.reflection_file).read_text()
            rc3, _, e3 = _obsidian_patch(event_path, reflection, "heading", "Reflection", "replace", create_if_missing=True)
            if rc3 != 0:
                warnings.append(f"Could not update Reflection section: {e3}")
        except OSError as e:
            warnings.append(f"Could not read reflection file: {e}")

    # Update Date History in profile
    fm = _parse_frontmatter(content)
    match_slug = fm.get("match", "")
    if match_slug:
        w = _update_profile_date_history(match_slug, event_id, fm.get("activity"), "completed")
        warnings.extend(w)

    return _ok(cmd, {"event_id": event_id, "status": "completed"}, warnings)


# --- Dossier / capture operations ---

def cmd_view_my_profile(args: argparse.Namespace) -> dict:
    cmd = "view-my-profile"
    err = _check_obsidian(cmd)
    if err:
        return err

    if not _file_exists(_MY_PROFILE):
        return _ok(cmd, {"profile": None, "message": "No user dossier yet. Say 'update my profile' or run update-my-profile to start one."})

    if args.section:
        rc, out, e = _obsidian_read(_MY_PROFILE, heading=args.section)
        if rc != 0:
            return _err(cmd, "SECTION_NOT_FOUND", f"Section '{args.section}' not found in dossier: {e}")
        return _ok(cmd, {"section": args.section, "content": out})

    content, rerr = _read_file(_MY_PROFILE)
    if rerr:
        return _err(cmd, "READ_FAILED", rerr)

    return _ok(cmd, {"profile": content})


def cmd_update_my_profile(args: argparse.Namespace) -> dict:
    cmd = "update-my-profile"
    err = _check_obsidian(cmd)
    if err:
        return err

    content = args.content or ""
    if args.file:
        try:
            content = Path(args.file).read_text()
        except OSError as e:
            return _err(cmd, "FILE_READ_ERROR", str(e))

    # Bootstrap dossier from template if absent
    warnings = []
    if not _file_exists(_MY_PROFILE):
        try:
            template = (_TEMPLATES_DIR / "my-profile-template.md").read_text()
        except OSError:
            template = "# My Profile\n\n## Quick Facts\n\n## Notes\n"
        rc, _, e = _obsidian_write(_MY_PROFILE, template)
        if rc != 0:
            return _err(cmd, "WRITE_FAILED", f"Could not create dossier: {e}")

    operation = args.operation or "append"
    rc, _, e = _obsidian_patch(
        _MY_PROFILE, content,
        target_type="heading", target=args.section,
        operation=operation, create_if_missing=True,
    )
    if rc != 0:
        return _err(cmd, "PATCH_FAILED", f"Could not update section '{args.section}': {e}")

    return _ok(cmd, {"section": args.section, "operation": operation}, warnings)


def cmd_capture(args: argparse.Namespace) -> dict:
    cmd = "capture"
    capture_type = args.type
    err = _check_obsidian(cmd)
    if err:
        return err

    if capture_type not in _CAPTURE_ROUTES:
        return _err(cmd, "INVALID_TYPE", f"Unknown capture type '{capture_type}'. Valid types: {', '.join(_CAPTURE_ROUTES)}")

    content = args.content or ""
    if args.file:
        try:
            content = Path(args.file).read_text()
        except OSError as e:
            return _err(cmd, "FILE_READ_ERROR", str(e))

    target_file, target_section, operation = _CAPTURE_ROUTES[capture_type]
    warnings = []

    if capture_type == "anecdote":
        # Special path: structured block append to anecdotes.md
        w = _ensure_anecdotes_file()
        warnings.extend(w)

        existing_content, _ = _read_file(_ANECDOTES)
        existing = _parse_anecdotes(existing_content or "")
        anecdote_id = _next_anecdote_id(existing)

        tags = [t.strip() for t in (args.tags or "").split(",") if t.strip()]
        block = _anecdote_block(
            anecdote_id=anecdote_id,
            title=args.title or content[:80],
            tags=tags,
            length=args.length or "short",
            hook=args.hook or "",
            summary=content,
        )
        rc, _, e = _obsidian_append(_ANECDOTES, "\n" + block)
        if rc != 0:
            return _err(cmd, "WRITE_FAILED", f"Could not append anecdote: {e}")

        # Update the anecdote-collection's updated frontmatter
        anec_content, _ = _read_file(_ANECDOTES)
        if anec_content:
            updated = re.sub(r'^updated: .+$', f"updated: {_today()}", anec_content, flags=re.MULTILINE)
            _obsidian_write(_ANECDOTES, updated)

        return _ok(cmd, {
            "type": "anecdote",
            "anecdote_id": anecdote_id,
            "target_path": _ANECDOTES,
            "title": args.title or content[:80],
        }, warnings)

    # Standard dossier section capture
    if not _file_exists(_MY_PROFILE):
        try:
            template = (_TEMPLATES_DIR / "my-profile-template.md").read_text()
        except OSError:
            template = "# My Profile\n\n## Quick Facts\n\n## Notes\n"
        rc, _, e = _obsidian_write(_MY_PROFILE, template)
        if rc != 0:
            return _err(cmd, "WRITE_FAILED", f"Could not create dossier: {e}")
        warnings.append("Created new dossier from template.")

    # For likes/dislikes/preferences, format as a bullet if not already
    if content and not content.strip().startswith("-") and capture_type in ("like", "dislike", "preference"):
        content = f"- {content.strip()}"

    rc, _, e = _obsidian_patch(
        target_file, content,
        target_type="heading", target=target_section,
        operation=operation, create_if_missing=True,
    )
    if rc != 0:
        return _err(cmd, "PATCH_FAILED", f"Could not capture to section '{target_section}': {e}")

    return _ok(cmd, {
        "type": capture_type,
        "target_path": target_file,
        "target_section": target_section,
        "operation": operation,
    }, warnings)


def cmd_list_anecdotes(args: argparse.Namespace) -> dict:
    cmd = "list-anecdotes"
    err = _check_obsidian(cmd)
    if err:
        return err

    if not _file_exists(_ANECDOTES):
        return _ok(cmd, {"anecdotes": [], "message": "No anecdotes yet. Use 'capture anecdote' to add one."})

    content, rerr = _read_file(_ANECDOTES)
    if rerr:
        return _err(cmd, "READ_FAILED", rerr)

    all_anecdotes = _parse_anecdotes(content)
    warnings = []

    # Filter by tags
    if args.tags:
        filter_tags = [t.strip().lower() for t in args.tags.split(",") if t.strip()]
        all_anecdotes = [
            a for a in all_anecdotes
            if any(t.lower() in filter_tags for t in a["tags"])
        ]

    # Filter by unused-with
    if args.unused_with:
        slug = _slugify(args.unused_with)
        all_anecdotes = [a for a in all_anecdotes if slug not in a["used_with"]]

    # Limit
    if args.limit:
        all_anecdotes = all_anecdotes[:args.limit]

    return _ok(cmd, {"anecdotes": all_anecdotes, "count": len(all_anecdotes)}, warnings)


def cmd_mark_anecdote_used(args: argparse.Namespace) -> dict:
    cmd = "mark-anecdote-used"
    anecdote_id = args.anecdote_id
    err = _check_obsidian(cmd)
    if err:
        return err

    content, rerr = _read_file(_ANECDOTES)
    if rerr:
        return _err(cmd, "NOT_FOUND", "anecdotes.md not found")

    # Find the block and update it
    if f"### {anecdote_id}" not in content:
        return _err(cmd, "NOT_FOUND", f"Anecdote '{anecdote_id}' not found")

    today = _today()
    content = re.sub(
        rf'(### {re.escape(anecdote_id)}.*?\*\*Last used:\*\*)[^\n]*',
        rf'\1 {today}',
        content, flags=re.DOTALL, count=1,
    )

    if args.with_match:
        slug = _slugify(args.with_match)
        # Append to Used with line
        def add_used_with(m: re.Match) -> str:
            existing = m.group(1).strip()
            if slug in [u.strip() for u in existing.split(",") if u.strip()]:
                return m.group(0)
            new_val = f"{existing}, {slug}".strip(", ")
            return f"**Used with:** {new_val}"
        content = re.sub(
            rf'(### {re.escape(anecdote_id)}.*?)\*\*Used with:\*\*([^\n]*)',
            lambda m: m.group(0)[:m.start(0)-m.start(0)] + re.sub(
                r'\*\*Used with:\*\*([^\n]*)',
                lambda mm: f'**Used with:** {(mm.group(1).strip() + ", " + slug).strip(", ")}',
                m.group(0),
                count=1,
            ),
            content, flags=re.DOTALL, count=1,
        )
        # Simpler regex that works correctly
        def update_used_with(match: re.Match) -> str:
            existing_val = match.group(1).strip()
            slugs = [s.strip() for s in existing_val.split(",") if s.strip()]
            if slug not in slugs:
                slugs.append(slug)
            return f"**Used with:** {', '.join(slugs)}"

        # Re-scope the replacement to just within this block
        block_start = content.find(f"### {anecdote_id}")
        next_block = content.find("\n### ", block_start + 1)
        block_end = next_block if next_block != -1 else len(content)
        block = content[block_start:block_end]
        block = re.sub(r'\*\*Used with:\*\*([^\n]*)', update_used_with, block, count=1)
        content = content[:block_start] + block + content[block_end:]

    rc, _, e = _obsidian_write(_ANECDOTES, content)
    if rc != 0:
        return _err(cmd, "WRITE_FAILED", f"Could not update anecdotes: {e}")

    return _ok(cmd, {"anecdote_id": anecdote_id, "last_used": today, "with_match": args.with_match or None})


# --- Voice / context ---

def cmd_voice_refresh(args: argparse.Namespace) -> dict:
    cmd = "voice-refresh"
    err = _check_obsidian(cmd)
    if err:
        return err

    try:
        content = Path(args.samples_file).read_text()
    except OSError as e:
        return _err(cmd, "FILE_READ_ERROR", str(e))

    rc, _, e = _obsidian_write(_VOICE_SAMPLES, content)
    if rc != 0:
        return _err(cmd, "WRITE_FAILED", f"Could not write voice samples: {e}")

    sample_count = len([l for l in content.splitlines() if l.strip()])
    return _ok(cmd, {"path": _VOICE_SAMPLES, "sample_count": sample_count})


def cmd_assemble_context(args: argparse.Namespace) -> dict:
    cmd = "assemble-context"
    slug = _slugify(args.match_slug)
    err = _check_obsidian(cmd)
    if err:
        return err

    profile_content, perr = _read_file(f"{_BASE}/{slug}/profile.md")
    if perr:
        return _err(cmd, "NOT_FOUND", f"No match found with slug '{slug}'")

    conv_content, _ = _read_file(f"{_BASE}/{slug}/conversation.md")
    my_profile, _ = _read_file(_MY_PROFILE)
    voice_samples, _ = _read_file(_VOICE_SAMPLES)

    warnings = []
    if not voice_samples:
        warnings.append("No voice samples found. Run voice-refresh before crafting to improve results.")

    # Relevant anecdotes: unused with this match
    anecdote_block_text = ""
    if _file_exists(_ANECDOTES):
        anec_content, _ = _read_file(_ANECDOTES)
        if anec_content:
            all_anecdotes = _parse_anecdotes(anec_content)
            unused = [a for a in all_anecdotes if slug not in a["used_with"]]
            if unused:
                lines = ["[ANECDOTES — unused with this match]"]
                for a in unused[:5]:
                    tags = ", ".join(a["tags"]) if a["tags"] else "no tags"
                    lines.append(f"- {a['id']}: {a['title']} [{tags}]")
                    if a["summary"]:
                        lines.append(f"  {a['summary'][:120]}{'...' if len(a['summary']) > 120 else ''}")
                anecdote_block_text = "\n".join(lines)

    # Assemble context block
    platform = ""
    if conv_content:
        m = re.search(r'\*\*Platform:\*\*\s*(\S+)', conv_content)
        if m:
            platform = m.group(1)

    stage = args.stage or "unknown"
    purpose = args.purpose or "craft a reply"

    parts = [
        f"[CONTEXT]",
        f"Platform: {platform or 'unknown'}",
        f"Conversation stage: {stage}",
        f"User wants: {purpose}",
        "Voice calibration: pre-loaded - skip Phase 1 and proceed directly to situation assessment.",
        "",
        "[ABOUT ME]",
        my_profile if my_profile else "Not available. User can build one via match-tracker's 'update my profile' flow.",
    ]

    if anecdote_block_text:
        parts += ["", anecdote_block_text]

    parts += [
        "",
        "[HER PROFILE]",
        profile_content or "(not available)",
        "",
        "[CONVERSATION LOG]",
        conv_content or "(no conversation logged yet)",
        "",
        "[VOICE: texting samples]",
        voice_samples or "(no voice samples yet — run voice-refresh)",
    ]

    context_block = "\n".join(parts)

    return _ok(cmd, {
        "context_block": context_block,
        "slug": slug,
        "stage": stage,
        "includes_my_profile": my_profile is not None,
        "includes_voice_samples": voice_samples is not None,
        "anecdote_count": len([a for a in _parse_anecdotes(anec_content if _file_exists(_ANECDOTES) else "") if slug not in a["used_with"]]) if _file_exists(_ANECDOTES) else 0,
    }, warnings)


# ---------------------------------------------------------------------------
# CLI wiring
# ---------------------------------------------------------------------------

def _build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="match_tracker", description="Match-tracker helper — all output is JSON.")
    p.add_argument("--dry-run", action="store_true", help="Log what would be sent to obsidian.py without executing.")
    sub = p.add_subparsers(dest="command", required=True)

    # list-matches
    lm = sub.add_parser("list-matches")
    lm.add_argument("--status", choices=["active", "paused", "archived", "all"], default=None)

    # match-summary
    ms = sub.add_parser("match-summary")
    ms.add_argument("slug")
    ms.add_argument("--include-conversation", action="store_true")

    # new-match
    nm = sub.add_parser("new-match")
    nm.add_argument("--name", required=True)
    nm.add_argument("--platform")
    nm.add_argument("--matched")
    nm.add_argument("--what-caught-eye")
    nm.add_argument("--profile-file")

    # log-exchange
    le = sub.add_parser("log-exchange")
    le.add_argument("slug")
    le.add_argument("--her")
    le.add_argument("--her-file")
    le.add_argument("--read")

    # log-reply
    lr = sub.add_parser("log-reply")
    lr.add_argument("slug")
    lr.add_argument("--my")
    lr.add_argument("--my-file")
    lr.add_argument("--sent")

    # update-match
    um = sub.add_parser("update-match")
    um.add_argument("slug")
    um.add_argument("--section", required=True)
    um.add_argument("--content")
    um.add_argument("--file")
    um.add_argument("--operation", choices=["append", "replace"])

    # disambiguate
    dq = sub.add_parser("disambiguate")
    dq.add_argument("old_slug")
    dq.add_argument("--to", required=True, dest="to")

    # schedule
    sc = sub.add_parser("schedule")
    sc.add_argument("match_slug")
    sc.add_argument("--date", required=True)
    sc.add_argument("--start")
    sc.add_argument("--end")
    sc.add_argument("--where")
    sc.add_argument("--activity")
    sc.add_argument("--notes")
    sc.add_argument("--notes-file")
    sc.add_argument("--tz")
    sc.add_argument("--buffer-minutes", type=int, default=0)
    sc.add_argument("--force", action="store_true", help="Schedule even when conflicts exist.")

    # list-events
    lev = sub.add_parser("list-events")
    lev.add_argument("--from", dest="from_date")
    lev.add_argument("--to", dest="to_date")
    lev.add_argument("--with", dest="with_match")
    lev.add_argument("--status")
    lev.add_argument("--upcoming", action="store_true")

    # check-conflict
    cc = sub.add_parser("check-conflict")
    cc.add_argument("--date", required=True)
    cc.add_argument("--start")
    cc.add_argument("--end")
    cc.add_argument("--buffer-minutes", type=int, default=0)
    cc.add_argument("--exclude")

    # event-summary
    evs = sub.add_parser("event-summary")
    evs.add_argument("event_id")

    # update-event
    ue = sub.add_parser("update-event")
    ue.add_argument("event_id")
    ue.add_argument("--date", dest="event_date")
    ue.add_argument("--start")
    ue.add_argument("--where")
    ue.add_argument("--status", choices=["scheduled", "confirmed", "completed", "cancelled", "rescheduled", "no-show"])
    ue.add_argument("--outcome-file")

    # cancel-event
    ce = sub.add_parser("cancel-event")
    ce.add_argument("event_id")
    ce.add_argument("--reason")

    # complete-event
    cmp = sub.add_parser("complete-event")
    cmp.add_argument("event_id")
    cmp.add_argument("--outcome-file")
    cmp.add_argument("--reflection-file")

    # view-my-profile
    vmp = sub.add_parser("view-my-profile")
    vmp.add_argument("--section")

    # update-my-profile
    ump = sub.add_parser("update-my-profile")
    ump.add_argument("--section", required=True)
    ump.add_argument("--content")
    ump.add_argument("--file")
    ump.add_argument("--operation", choices=["append", "replace"])

    # capture
    cap = sub.add_parser("capture")
    cap.add_argument("type", choices=list(_CAPTURE_ROUTES))
    cap.add_argument("--content")
    cap.add_argument("--file")
    cap.add_argument("--tags")
    cap.add_argument("--match")
    cap.add_argument("--title", help="Anecdote title (anecdote type only)")
    cap.add_argument("--length", choices=["short", "medium", "long"], help="Anecdote length (anecdote type only)")
    cap.add_argument("--hook", help="What this anecdote hooks well (anecdote type only)")

    # list-anecdotes
    la = sub.add_parser("list-anecdotes")
    la.add_argument("--tags")
    la.add_argument("--unused-with")
    la.add_argument("--limit", type=int)

    # mark-anecdote-used
    mau = sub.add_parser("mark-anecdote-used")
    mau.add_argument("anecdote_id")
    mau.add_argument("--with", dest="with_match")
    mau.add_argument("--date")

    # voice-refresh
    vr = sub.add_parser("voice-refresh")
    vr.add_argument("--samples-file", required=True)

    # assemble-context
    ac = sub.add_parser("assemble-context")
    ac.add_argument("match_slug")
    ac.add_argument("--stage", choices=["opener", "early-game", "mid-game", "date-seed", "recovery", "logistics"])
    ac.add_argument("--purpose")

    return p


_COMMAND_MAP = {
    "list-matches": cmd_list_matches,
    "match-summary": cmd_match_summary,
    "new-match": cmd_new_match,
    "log-exchange": cmd_log_exchange,
    "log-reply": cmd_log_reply,
    "update-match": cmd_update_match,
    "disambiguate": cmd_disambiguate,
    "schedule": cmd_schedule,
    "list-events": cmd_list_events,
    "check-conflict": cmd_check_conflict,
    "event-summary": cmd_event_summary,
    "update-event": cmd_update_event,
    "cancel-event": cmd_cancel_event,
    "complete-event": cmd_complete_event,
    "view-my-profile": cmd_view_my_profile,
    "update-my-profile": cmd_update_my_profile,
    "capture": cmd_capture,
    "list-anecdotes": cmd_list_anecdotes,
    "mark-anecdote-used": cmd_mark_anecdote_used,
    "voice-refresh": cmd_voice_refresh,
    "assemble-context": cmd_assemble_context,
}


def main() -> None:
    parser = _build_parser()
    args = parser.parse_args()

    handler = _COMMAND_MAP.get(args.command)
    if not handler:
        _emit(_err(args.command, "UNKNOWN_COMMAND", f"No handler for '{args.command}'"))
        sys.exit(1)

    try:
        result = handler(args)
    except Exception as exc:  # noqa: BLE001
        _emit(_err(args.command or "unknown", "INTERNAL_ERROR", str(exc)))
        sys.exit(1)

    _emit(result)


if __name__ == "__main__":
    main()
