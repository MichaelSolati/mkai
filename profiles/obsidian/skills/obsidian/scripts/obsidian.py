#!/usr/bin/env python3
"""Obsidian — Zero-dependency CLI for querying your Obsidian vault
via the Local REST API plugin.

Usage:
  obsidian.py search <query>
  obsidian.py context <query> [--top N]
  obsidian.py read <path> [--heading "X"] [--frontmatter key] [--map]
  obsidian.py write <path> <content|--file FILE>
  obsidian.py append <path> <content|--file FILE>
  obsidian.py patch <path> <content|--file FILE> --target-type heading|block|frontmatter --target <name> [--operation append|prepend|replace] [--create-if-missing]
  obsidian.py delete <path>
  obsidian.py list [folder]
  obsidian.py tags
  obsidian.py active
  obsidian.py periodic <period> [YYYY MM DD]
  obsidian.py commands [--exec <commandId>]
  obsidian.py open <path> [--new-leaf]
  obsidian.py dql <query>
  obsidian.py jsonlogic <json-expression>
  obsidian.py init <path> [--type TYPE] [--title TITLE] [--tags t1,t2] [--status STATUS]
  obsidian.py meta <path> [--set key=value ...] [--show]
  obsidian.py relate <path> [--top N] [--dry-run]
  obsidian.py brain <type> <content|--file FILE> --scope <scope> [--tags tags] [--title T] [--ref R]
  obsidian.py whoami
  obsidian.py setup
"""

from __future__ import annotations

import json
import os
import re
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from argparse import ArgumentParser, RawDescriptionHelpFormatter
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path
from typing import Literal

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

SKILL_DIR = Path(__file__).resolve().parent.parent
CONFIG_PATH = SKILL_DIR / "config.yaml"
CONFIG_EXAMPLE_PATH = SKILL_DIR / "config.yaml.example"
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 27123
DEFAULT_IDENTITY_PATH = "identity/me.md"

SETUP_GUIDE = """\
Obsidian — Setup Required
===========================

No configuration found. Run setup to create your config:

  python3 {script} setup

This will:
  1. Create config.yaml from the example template
  2. Check Obsidian connectivity
  3. Initialize your Identity document
"""

VALID_TYPES = {"note", "meeting", "decision", "postmortem", "rfc", "runbook", "project", "daily", "reference"}
VALID_STATUSES = {"draft", "active", "review", "archived"}
VALID_OUTCOMES = {"proposed", "approved", "rejected", "superseded"}
VALID_PRIORITIES = {"low", "medium", "high", "critical"}

def _normalize_vault_path(path: str, kind: Literal["note", "folder", "auto"] = "auto") -> str:
    path = path.strip()
    if not path: raise SystemExit("Path must not be empty")
    if any(c in path for c in ("?", "#")): raise SystemExit(f"Path contains URL-breaking characters (?, #): {path!r}")
    for seg in path.split("/"):
        if seg == "..": raise SystemExit(f"Path traversal not allowed: {path!r}")
    
    # Enforce slug convention: lowercase and hyphens for spaces/underscores
    segments = [s.lower().replace(" ", "-").replace("_", "-") for s in path.split("/") if s]
    path = "/".join(segments)
    
    if kind == "note":
        if path.endswith("/"): path = path.rstrip("/")
        if "." not in Path(path).name: path = path + ".md"
    elif kind == "folder":
        if not path.endswith("/"): path = path + "/"
    return path

def _normalize_brain_scope(scope: str) -> tuple[Literal["global", "repo", "branch", "category"], str, str]:
    scope = scope.strip().lower().replace(" ", "-").replace("_", "-")
    if not scope: raise SystemExit("--scope must not be empty")
    if scope == "global": return ("global", "", "")
    if "/" in scope:
        repo, branch = scope.split("/", 1)
        return ("branch", repo.strip(), branch.strip().rstrip("/"))
    return ("repo", scope, "")

def _load_config() -> dict:
    if not CONFIG_PATH.exists(): return {}
    raw = CONFIG_PATH.read_text()
    cfg: dict = {}
    for line in raw.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"): continue
        m = re.match(r"^([\w_]+)\s*:\s*(.+)$", stripped)
        if m:
            key = m.group(1)
            val = m.group(2).strip().strip('"').strip("'")
            cfg[key] = val
    return cfg

def _get_api_url(cfg: dict) -> str:
    return f"http://{cfg.get('host', DEFAULT_HOST)}:{cfg.get('port', DEFAULT_PORT)}"

def _get_api_key(cfg: dict) -> str | None:
    return cfg.get("api_key")

def _get_identity_path(cfg: dict) -> str:
    return cfg.get("identity_path", DEFAULT_IDENTITY_PATH)

def _build_parser() -> ArgumentParser:
    p = ArgumentParser(prog="obsidian", description="Query and manage an Obsidian vault via REST.", formatter_class=RawDescriptionHelpFormatter)
    p.add_argument("--key", dest="api_key", help="API key")
    p.add_argument("--url", dest="api_url", help="Base URL")
    sub = p.add_subparsers(dest="command")

    s = sub.add_parser("search")
    s.add_argument("query", nargs="+")
    s.add_argument("--context-length", type=int, default=100)

    s = sub.add_parser("context")
    s.add_argument("query", nargs="+")
    s.add_argument("--top", type=int, default=3)

    s = sub.add_parser("read")
    s.add_argument("path")
    s.add_argument("--heading")
    s.add_argument("--frontmatter")
    s.add_argument("--map", action="store_true")

    s = sub.add_parser("write")
    s.add_argument("path")
    s.add_argument("content", nargs="?")
    s.add_argument("--file", dest="content_file")

    s = sub.add_parser("append")
    s.add_argument("path")
    s.add_argument("content", nargs="?")
    s.add_argument("--file", dest="content_file")

    s = sub.add_parser("patch")
    s.add_argument("path")
    s.add_argument("content", nargs="?")
    s.add_argument("--file", dest="content_file")
    s.add_argument("--target-type", required=True, choices=["heading", "block", "frontmatter"])
    s.add_argument("--target", required=True)
    s.add_argument("--operation", choices=["append", "prepend", "replace"], default="replace")
    s.add_argument("--create-if-missing", action="store_true")

    s = sub.add_parser("delete")
    s.add_argument("path")

    s = sub.add_parser("list")
    s.add_argument("folder", nargs="?")

    sub.add_parser("tags")
    sub.add_parser("active")

    s = sub.add_parser("periodic")
    s.add_argument("period", choices=["daily", "weekly", "monthly", "quarterly", "yearly"])
    s.add_argument("year", nargs="?", type=int)
    s.add_argument("month", nargs="?", type=int)
    s.add_argument("day", nargs="?", type=int)

    s = sub.add_parser("commands")
    s.add_argument("--exec", dest="exec_id")

    s = sub.add_parser("open")
    s.add_argument("path")
    s.add_argument("--new-leaf", action="store_true")

    s = sub.add_parser("dql")
    s.add_argument("query", nargs="+")

    s = sub.add_parser("jsonlogic")
    s.add_argument("expression")

    s = sub.add_parser("relate")
    s.add_argument("path")
    s.add_argument("--top", type=int, default=10)
    s.add_argument("--dry-run", action="store_true")

    s = sub.add_parser("brain")
    s.add_argument("type", choices=["decision", "pattern", "mistake", "question", "learning"])
    s.add_argument("content", nargs="?")
    s.add_argument("--file", dest="content_file")
    s.add_argument("--scope", required=True)
    s.add_argument("--tags")
    s.add_argument("--title")
    s.add_argument("--ref")

    sub.add_parser("whoami")
    sub.add_parser("setup")

    s = sub.add_parser("init")
    s.add_argument("path")
    s.add_argument("--type", choices=sorted(VALID_TYPES), default="note")
    s.add_argument("--title")
    s.add_argument("--tags")
    s.add_argument("--status", choices=sorted(VALID_STATUSES), default="draft")
    s.add_argument("--author")
    s.add_argument("--participants")
    s.add_argument("--deciders")
    s.add_argument("--owner")
    s.add_argument("--priority", choices=sorted(VALID_PRIORITIES))
    s.add_argument("--due")
    s.add_argument("--service")
    s.add_argument("--outcome", choices=sorted(VALID_OUTCOMES))
    s.add_argument("--body", default="")

    s = sub.add_parser("index-update")
    s.add_argument("--dry-run", action="store_true")

    s = sub.add_parser("vault-status")
    s.add_argument("--stale-days", type=int, default=60)

    s = sub.add_parser("link-health")
    s.add_argument("--top", type=int, default=10)

    s = sub.add_parser("meta")
    s.add_argument("path")
    s.add_argument("--set", nargs="+", metavar="KEY=VALUE")
    s.add_argument("--show", action="store_true")

    return p

class ObsidianClient:
    def __init__(self, api_url: str, api_key: str):
        self.api_url = api_url.rstrip("/")
        self.api_key = api_key
        self._ssl_ctx = ssl.create_default_context()
        self._ssl_ctx.check_hostname = False
        self._ssl_ctx.verify_mode = ssl.CERT_NONE

    def request(self, method: str, path: str, *, body: str | bytes | None = None, headers: dict[str, str] | None = None, accept: str = "application/json", content_type: str | None = None) -> dict | str:
        url = f"{self.api_url}{urllib.parse.quote(path, safe='/?=&')}"
        hdrs = {"Authorization": f"Bearer {self.api_key}", "Accept": accept}
        if headers: hdrs.update(headers)
        data = None
        if body is not None:
            if isinstance(body, dict): data = json.dumps(body).encode(); hdrs.setdefault("Content-Type", "application/json")
            elif isinstance(body, str): data = body.encode(); hdrs.setdefault("Content-Type", "text/markdown")
            else: data = body
        if content_type: hdrs["Content-Type"] = content_type
        req = urllib.request.Request(url, data=data, headers=hdrs, method=method)
        try:
            # Added 5-second timeout to prevent indefinite hangs
            with urllib.request.urlopen(req, context=self._ssl_ctx, timeout=5) as resp:
                raw = resp.read().decode()
        except urllib.error.HTTPError as e:
            raise SystemExit(f"HTTP {e.code}: {e.read().decode()[:500]}")
        except urllib.error.URLError as e:
            raise SystemExit(f"Connection Error: Obsidian Local REST API is unreachable. Is Obsidian running and the plugin enabled? ({e.reason})")
        except TimeoutError:
            raise SystemExit("Request Timeout: Obsidian took too long to respond. The app might be frozen or closed.")
        
        try: return json.loads(raw)
        except: return raw

def cmd_whoami(client: ObsidianClient, _args, cfg: dict, **_kw) -> None:
    path = _get_identity_path(cfg)
    try:
        note = client.request("GET", f"/vault/{_normalize_vault_path(path, 'note')}", accept="application/vnd.olrapi.note+json")
        _print_note(note)
    except:
        print(f"[!!] Identity not found: {path}. Run setup.")

def _print_note(note: dict | str) -> None:
    if isinstance(note, dict) and "content" in note:
        if note.get("path"): print(f"# {note['path']}")
        if note.get("tags"): print(f"Tags: {', '.join(note['tags'])}")
        fm = note.get("frontmatter")
        if fm:
            print("Frontmatter:")
            for k, v in fm.items(): print(f"  {k}: {v}")
        print(f"\n{note['content']}")
    else: print(note)

def cmd_search(client: ObsidianClient, args, **_kw) -> None:
    query = " ".join(args.query)
    qs = urllib.parse.urlencode({"query": query, "contextLength": args.context_length})
    results = client.request("POST", f"/search/simple/?{qs}")
    for r in (results or []):
        print(f"  {r['filename']} (score: {r['score']})")

def cmd_context(client: ObsidianClient, args, **_kw) -> None:
    query = " ".join(args.query)
    results = client.request("POST", f"/search/simple/?{urllib.parse.urlencode({'query': query})}")
    for r in (results or [])[:args.top]:
        print("="*60 + f"\n# {r['filename']}\n" + "="*60)
        _print_note(client.request("GET", f"/vault/{r['filename']}", accept="application/vnd.olrapi.note+json"))

def cmd_read(client: ObsidianClient, args, **_kw) -> None:
    accept = "application/vnd.olrapi.note+json"
    headers = {}
    if args.map: accept = "application/vnd.olrapi.document-map+json"
    elif args.heading: headers = {"Target-Type": "heading", "Target": args.heading}
    elif args.frontmatter: headers = {"Target-Type": "frontmatter", "Target": args.frontmatter}
    res = client.request("GET", f"/vault/{_normalize_vault_path(args.path, 'note')}", accept=accept, headers=headers)
    if args.map: print(json.dumps(res, indent=2))
    else: _print_note(res)

def _resolve_content(args) -> str:
    if getattr(args, "content_file", None): return Path(args.content_file).read_text()
    if args.content: return args.content
    raise SystemExit("Content required")

def cmd_write(client: ObsidianClient, args, **_kw):
    client.request("PUT", f"/vault/{_normalize_vault_path(args.path, 'note')}", body=_resolve_content(args), content_type="text/markdown")

def cmd_append(client: ObsidianClient, args, **_kw):
    client.request("POST", f"/vault/{_normalize_vault_path(args.path, 'note')}", body=_resolve_content(args), content_type="text/markdown")

def cmd_patch(client: ObsidianClient, args, **_kw):
    ct = "application/json" if args.target_type == "frontmatter" else "text/markdown"
    client.request("PATCH", f"/vault/{_normalize_vault_path(args.path, 'note')}", body=_resolve_content(args), content_type=ct, headers={"Target-Type": args.target_type, "Target": args.target, "Operation": args.operation, "Create-Target-If-Missing": "true" if args.create_if_missing else "false"})

def cmd_delete(client: ObsidianClient, args, **_kw):
    client.request("DELETE", f"/vault/{_normalize_vault_path(args.path, 'note')}")

def cmd_list(client: ObsidianClient, args, **_kw):
    path = f"/vault/{_normalize_vault_path(args.folder, 'folder')}" if args.folder else "/vault/"
    print(client.request("GET", path))

def cmd_tags(client: ObsidianClient, _args, **_kw):
    print(client.request("GET", "/tags/"))

def cmd_active(client: ObsidianClient, _args, **_kw):
    _print_note(client.request("GET", "/active/", accept="application/vnd.olrapi.note+json"))

def cmd_periodic(client: ObsidianClient, args, **_kw):
    path = f"/periodic/{args.period}/{args.year}/{args.month}/{args.day}/" if args.year else f"/periodic/{args.period}/"
    _print_note(client.request("GET", path, accept="application/vnd.olrapi.note+json"))

def cmd_commands(client: ObsidianClient, args, **_kw):
    if args.exec_id: client.request("POST", f"/commands/{args.exec_id}/")
    else: print(client.request("GET", "/commands/"))

def cmd_open(client: ObsidianClient, args, **_kw):
    client.request("POST", f"/open/{_normalize_vault_path(args.path, 'note')}{'?newLeaf=true' if args.new_leaf else ''}")

def cmd_dql(client: ObsidianClient, args, **_kw):
    print(client.request("POST", "/search/", body=" ".join(args.query), content_type="application/vnd.olrapi.dataview.dql+txt"))

def cmd_jsonlogic(client: ObsidianClient, args, **_kw):
    print(client.request("POST", "/search/", body=json.loads(args.expression), content_type="application/vnd.olrapi.jsonlogic+json"))

def cmd_relate(client: ObsidianClient, args, **_kw):
    # Search for notes with similar tags or content to provide 'related' context
    res = client.request("GET", f"/vault/{_normalize_vault_path(args.path, 'note')}", accept="application/vnd.olrapi.note+json")
    if isinstance(res, dict) and res.get("tags"):
        tags = " OR ".join(res["tags"])
        print(f"Related notes (by tags: {tags}):")
        qs = urllib.parse.urlencode({"query": tags})
        search_res = client.request("POST", f"/search/simple/?{qs}")
        for r in (search_res or [])[:args.top]:
            if r["filename"] != res.get("path"):
                print(f"  - {r['filename']}")

def cmd_meta(client: ObsidianClient, args, **_kw):
    path = _normalize_vault_path(args.path, "note")
    if args.set:
        for kv in args.set:
            k, v = kv.split("=", 1)
            client.request("PATCH", f"/vault/{path}", body=json.dumps(v), content_type="application/json", headers={"Target-Type": "frontmatter", "Target": k, "Operation": "replace", "Create-Target-If-Missing": "true"})
            print(f"Set {k}={v}")
    res = client.request("GET", f"/vault/{path}", accept="application/vnd.olrapi.note+json")
    if args.show or not args.set:
        if isinstance(res, dict) and res.get("frontmatter"):
            for k, v in res["frontmatter"].items(): print(f"  {k}: {v}")

def cmd_index_update(client: ObsidianClient, args, **_kw):
    # Crawl core folders to build a high-level map
    spheres = ["projects", "personal", "dating", "work"]
    lines = [f"---\nupdated: {date.today()}\n---\n", "# Vault Index\n"]
    
    for s in spheres:
        try:
            res = client.request("GET", f"/vault/{s}/")
            if isinstance(res, dict) and res.get("files"):
                lines.append(f"## {s.title()}")
                for f in res["files"]:
                    if f.endswith("/"): lines.append(f"- [[{s}/{f.rstrip('/')}/index|{f.rstrip('/')}]]")
                lines.append("")
        except: continue
        
    index_content = "\n".join(lines)
    if args.dry_run: print(index_content)
    else:
        client.request("PUT", "/vault/_meta/index.md", body=index_content, content_type="text/markdown")
        print("Updated _meta/index.md")

def cmd_vault_status(client: ObsidianClient, args, **_kw):
    res = client.request("GET", "/vault/")
    files = [f for f in res.get("files", []) if f.endswith(".md")]
    folders: dict[str, int] = {}
    for f in files:
        root = f.split("/")[0] if "/" in f else "(root)"
        folders[root] = folders.get(root, 0) + 1
    print(f"Notes: {len(files)}")
    for fld, count in sorted(folders.items(), key=lambda x: -x[1]):
        print(f"  {fld}/: {count}")

def cmd_link_health(client: ObsidianClient, args, **_kw):
    res = client.request("GET", "/vault/")
    files = [f for f in res.get("files", []) if f.endswith(".md")]
    print(f"Crawling {len(files)} notes for link health...")
    
    forward: dict[str, list[str]] = {}
    backward: dict[str, list[str]] = {f: [] for f in files}
    unresolved = []

    for f in files:
        content = client.request("GET", f"/vault/{f}", accept="text/markdown")
        links = re.findall(r"\[\[([^|\]]+)", content)
        forward[f] = []
        for l in links:
            target = _normalize_vault_path(l, "note")
            if target in files:
                forward[f].append(target)
                if f not in backward[target]: backward[target].append(f)
            else: unresolved.append((f, l))

    orphans = [f for f, b in backward.items() if not b and not f.startswith(("_meta", "templates"))]
    print(f"\nOrphans ({len(orphans)}):")
    for o in orphans[:args.top]: print(f"  - {o}")
    
    print(f"\nUnresolved Links ({len(unresolved)}):")
    for f, l in unresolved[:args.top]: print(f"  - {f} -> [[{l}]]")

def cmd_setup(client: ObsidianClient | None, _args, cfg: dict, **_kw) -> None:
    if CONFIG_PATH.exists(): print(f"[OK] Config at {CONFIG_PATH}")
    else:
        CONFIG_PATH.write_text('api_key: ""\n# host: 127.0.0.1\n# port: 27123\n# identity_path: "identity/me.md"\n')
        print(f"Created {CONFIG_PATH}. Add API key.")
    if not _get_api_key(cfg): print("[!!] api_key missing"); return
    url = _get_api_url(cfg)
    try:
        urllib.request.urlopen(urllib.request.Request(f"{url}/", headers={"Accept": "application/json"}), context=ssl._create_unverified_context(), timeout=3)
        print(f"[OK] Reachable: {url}")
    except: print(f"[!!] Unreachable: {url}"); return
    id_p = _get_identity_path(cfg)
    try: client.request("GET", f"/vault/{_normalize_vault_path(id_p, 'note')}", accept="text/markdown"); print(f"[OK] Identity at {id_p}")
    except: print(f"[!!] Identity missing at {id_p}. Run: obsidian.py init \"{id_p}\"")

def cmd_init(client: ObsidianClient, args, **_kw):
    path = _normalize_vault_path(args.path, "note")
    title = args.title or Path(path).stem.title()
    content = f"---\ntitle: \"{title}\"\ntype: {args.type}\ncreated: {date.today()}\nstatus: {args.status}\n---\n\n# {title}\n\n{args.body}"
    client.request("PUT", f"/vault/{path}", body=content, content_type="text/markdown")
    print(f"Initialized {path}")

_BRAIN_ROUTES = {"decision": ("decisions.md", "date"), "pattern": ("patterns.md", "title"), "mistake": ("mistakes.md", "date"), "question": ("open-questions.md", "date"), "learning": ("tools-and-tricks.md", "date")}

def cmd_brain(client: ObsidianClient, args, **_kw):
    fname, style = _BRAIN_ROUTES[args.type]
    kind, repo, branch = _normalize_brain_scope(args.scope)
    if kind == "global": path = f"global/{fname}"
    elif kind == "branch": path = f"projects/{repo}/branches/{branch}/notes.md"
    elif kind == "repo": path = f"projects/{repo}/{fname}"
    else: path = f"{args.scope}/{fname}"
    header = f"## {date.today()} — {args.title or 'Untitled'}" if style == "date" else f"## {args.title or 'Untitled'}"
    entry = f"\n{header}\n\n{_resolve_content(args)}\n"
    try: client.request("GET", f"/vault/{path}")
    except: client.request("PUT", f"/vault/{path}", body=f"# {Path(path).stem}\n", content_type="text/markdown")
    client.request("POST", f"/vault/{path}", body=entry, content_type="text/markdown")
    print(f"Saved to {path}")

DISPATCH = {"search": cmd_search, "context": cmd_context, "read": cmd_read, "write": cmd_write, "append": cmd_append, "patch": cmd_patch, "delete": cmd_delete, "list": cmd_list, "tags": cmd_tags, "active": cmd_active, "periodic": cmd_periodic, "commands": cmd_commands, "open": cmd_open, "dql": cmd_dql, "jsonlogic": cmd_jsonlogic, "init": cmd_init, "meta": cmd_meta, "relate": cmd_relate, "setup": cmd_setup, "brain": cmd_brain, "whoami": cmd_whoami, "index-update": cmd_index_update, "vault-status": cmd_vault_status, "link-health": cmd_link_health}

def main():
    p = _build_parser(); args = p.parse_args()
    if not args.command: p.print_help(); return
    cfg = _load_config()
    key = args.api_key or _get_api_key(cfg)
    url = args.api_url or _get_api_url(cfg)
    client = ObsidianClient(url, key) if key else None
    if args.command == "setup": cmd_setup(client, args, cfg); return
    if not client: print("Run setup first."); return
    try: DISPATCH[args.command](client, args, cfg=cfg)
    except SystemExit as e: print(e)
    except Exception as e: print(f"Error: {e}")

if __name__ == "__main__": main()
