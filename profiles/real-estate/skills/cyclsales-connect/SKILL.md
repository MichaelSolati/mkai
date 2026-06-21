---
name: cyclsales-connect
description: "Bridge between Claude Skills (strategy) and CyclSales CRM (execution). Push leads into CRM pipelines, look up contacts, view pipeline status, pull conversation history, manage tags, and trigger automations. When a lead is researched and pushed to CyclSales, automated follow-up sequences fire without the agent lifting a finger."
---

# CyclSales Connect Skill

> **Purpose:** Push the intelligence from Claude Skills into CyclSales so the automated follow-up, nurture sequences, and pipeline tracking run on autopilot. This is where strategy becomes execution.

---

## PREREQUISITE

- **GHL Private Integration Token (PIT)** - stored as env var `GHL_API_KEY` or in `.env`. Never hardcode.
- **GHL Location ID** - stored as env var `GHL_LOCATION_ID` or in `./clients/cyclsales-config.md`. Required for all API calls.
- **No MCP server needed** - this skill uses direct API calls via WebFetch or curl. GHL has no MCP integration.

---

## WHAT THIS SKILL DOES

- **Pipeline Sync** - Push leads from Lead Recon (or any skill) into GHL as contacts + opportunities. Map lead classification to pipeline stages. Include all property data as custom fields.
- **Contact Lookup** - Search GHL contacts by phone, email, or name before creating duplicates. Show existing tags, notes, and last activity.
- **Pipeline View** - Pull current GHL pipeline and display it in terminal-native format (~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md style). See every deal at a glance.
- **Conversation History** - Pull recent SMS and email conversations for a contact. Know what was already said before you follow up.
- **Tag Management** - Add or remove tags based on skill outputs. Tags trigger GHL workflow automations (nurture sequences, review requests, etc.).
- **Workflow Trigger** - List available GHL workflows. Note: workflows cannot be triggered via API directly, but tagging a contact fires any workflow that watches for that tag.

## WHAT THIS SKILL DOES NOT DO

- Does not replace Lead Recon (research happens there first, then sync here)
- Does not send SMS/email directly (GHL workflows handle delivery after tagging)
- Does not trigger workflows via API (GHL limitation - use tag-based triggers instead)
- Does not access campaigns, forms, surveys, invoices, or payments (not available via API)
- Does not store the API token - reads it from env at runtime

---

## INPUTS NEEDED

| Input | Required | Example |
|-------|----------|---------|
| Action | Yes | "push lead", "lookup contact", "view pipeline", "pull conversations", "tag", "list workflows" |
| Client data | For push/lookup | Name, phone, email, address - from Lead Recon output or manual entry |
| Contact ID | For conversations/tags | GHL contact ID (returned from lookup or push) |
| Tag name(s) | For tag action | "hot-lead", "ready-now-seller", "nurture-sequence-active" |

> **Minimum viable input:** An action + the relevant data. For pipeline sync, the Lead Recon output provides everything needed.

---

## GOAL

- Primary: Get every researched lead into CyclSales so automated follow-up fires immediately
- Secondary: Eliminate duplicate contacts - always check before creating
- Tertiary: Give the agent a single-terminal view of their GHL pipeline without opening the browser

---

## CONFIGURATION

### First-Time Setup

On first run, check for GHL credentials:

```
1. Check env var GHL_API_KEY
2. Check env var GHL_LOCATION_ID
3. Check ./clients/cyclsales-config.md for stored location ID
4. If any are missing → show setup instructions (see GRACEFUL FALLBACK below)
```

### cyclsales-config.md Format

File: `./clients/cyclsales-config.md`

```markdown
# CyclSales Configuration

Location ID: {location-id}
Last Verified: YYYY-MM-DD
Pipeline ID: {pipeline-id}
Pipeline Name: {pipeline-name}

## Pipeline Stages
| Stage Name | Stage ID | Maps To |
|------------|----------|---------|
| New Lead | {id} | Lead Recon score 1-4 |
| Warm Lead | {id} | Lead Recon score 5-7 |
| Hot Lead | {id} | Lead Recon score 8-10 |
| CMA Sent | {id} | After /comp-crusher |
| Listing Appointment | {id} | After /listing-presentation |
| Listed | {id} | After /listing-arsenal |
| Under Contract | {id} | Manual |
| Closed | {id} | Manual |

## Custom Field IDs
| Field | GHL Field ID | Source |
|-------|-------------|--------|
| Property Address | {id} | Lead Recon |
| Beds | {id} | Lead Recon |
| Baths | {id} | Lead Recon |
| Sqft | {id} | Lead Recon |
| Year Built | {id} | Lead Recon |
| Lot Size | {id} | Lead Recon |
| Estimated Value | {id} | Lead Recon / Comp Crusher |
| Lead Score | {id} | Lead Recon |
| Lead Type | {id} | Lead Recon |
| Lead Source | {id} | Lead Recon |

## Standard Tags
| Tag | Applied When |
|-----|-------------|
| hot-lead | Lead Recon score 8-10 |
| warm-lead | Lead Recon score 5-7 |
| cool-lead | Lead Recon score 1-4 |
| ready-now-seller | Lead classified as Ready Now Seller |
| ready-now-buyer | Lead classified as Ready Now Buyer |
| future-seller | Lead classified as Future Seller |
| future-buyer | Lead classified as Future Buyer |
| investor-lead | Lead classified as Investor |
| relocation-lead | Lead classified as Relocation |
| sphere-referral | Lead classified as Sphere Referral |
| nurture-sequence-active | After /nurture-coach runs |
| cma-delivered | After /comp-crusher output sent |
| listing-appointment-set | After /listing-presentation runs |
| review-requested | After /review-engine runs |
| sphere-member | After deal closes, added to sphere |
```

### First-Run Auto-Discovery

On the first successful API connection, automatically discover and cache:

```
1. GET /opportunities/pipelines?locationId={id}
   → Store pipeline ID, name, and all stage IDs
   → Map stages to skill outputs (best-guess, agent confirms)

2. GET /locations/{id}/customFields
   → Store field IDs for property data fields
   → Match field names to Lead Recon output keys

3. GET /locations/{id}/tags
   → Store existing tags
   → Suggest standard tags to create if missing

4. Save everything to ./clients/cyclsales-config.md
```

---

## FRAMEWORK: API Reference

### Base Configuration

```
Base URL:    https://services.leadconnectorhq.com
Auth:        Bearer {GHL_API_KEY}
Version:     2021-07-28
Headers:
  Authorization: Bearer {token}
  Version: 2021-07-28
  Content-Type: application/json
```

### Endpoint Map

| Action | Method | Endpoint | Notes |
|--------|--------|----------|-------|
| Search contacts | GET | /contacts/?locationId={id}&query={search} | Search by name, phone, or email |
| Get contact | GET | /contacts/{contactId} | Full contact record |
| Create contact | POST | /contacts/ | Include locationId in body |
| Update contact | PUT | /contacts/{contactId} | Partial update supported |
| Search opportunities | GET | /opportunities/search?location_id={id} | Deals with pipeline stages |
| Create opportunity | POST | /opportunities/ | Attach to contact + pipeline stage |
| Get pipelines | GET | /opportunities/pipelines?locationId={id} | Pipeline structure with stages |
| Get conversations | GET | /conversations/search?locationId={id}&contactId={id} | SMS/email history |
| Get workflows | GET | /workflows/?locationId={id} | List automations |
| Get calendars | GET | /calendars/?locationId={id} | Appointment calendars |
| Get tags | GET | /locations/{id}/tags | All location tags |
| Get custom fields | GET | /locations/{id}/customFields | Custom field definitions |

### Contact Create/Update Body

```json
{
  "locationId": "{location-id}",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah@email.com",
  "phone": "+12145551234",
  "address1": "4215 Oak Hollow Dr",
  "city": "Frisco",
  "state": "TX",
  "postalCode": "75034",
  "source": "Zillow inquiry",
  "tags": ["hot-lead", "ready-now-seller"],
  "customField": {
    "{beds-field-id}": "4",
    "{baths-field-id}": "2.5",
    "{sqft-field-id}": "2340",
    "{year-built-field-id}": "2003",
    "{estimated-value-field-id}": "$485,000",
    "{lead-score-field-id}": "9",
    "{lead-type-field-id}": "Ready Now Seller"
  }
}
```

### Opportunity Create Body

```json
{
  "pipelineId": "{pipeline-id}",
  "locationId": "{location-id}",
  "name": "Johnson - 4215 Oak Hollow Dr, Frisco TX",
  "pipelineStageId": "{hot-lead-stage-id}",
  "status": "open",
  "contactId": "{contact-id}",
  "monetaryValue": 485000,
  "source": "Lead Recon"
}
```

---

## FRAMEWORK: Action Playbooks

### 1. Pipeline Sync (Push Lead to CyclSales)

This is the primary action. Takes Lead Recon output and pushes it into GHL.

```
STEP 1: Verify GHL connection
  → Check for GHL_API_KEY and GHL_LOCATION_ID
  → If missing → graceful fallback (see below)

STEP 2: Check for existing contact
  → GET /contacts/?locationId={id}&query={phone}
  → If no phone, try email
  → If no email, try name
  → If found → show existing record, ask "Update or skip?"
  → If not found → proceed to create

STEP 3: Create contact
  → POST /contacts/ with all available data
  → Map Lead Recon fields to GHL contact fields
  → Apply tags based on lead classification and score

STEP 4: Create opportunity
  → POST /opportunities/ attached to the new contact
  → Set pipeline stage based on lead score:
    Score 8-10 → Hot Lead stage
    Score 5-7  → Warm Lead stage
    Score 1-4  → New Lead stage
  → Set monetary value to estimated property value

STEP 5: Confirm and display
  → Show what was created in terminal-native format
  → Note which tags were applied (and which workflows will fire)
  → Save sync record to ./clients/{slug}/cyclsales-sync.md

STEP 6: Tag-triggered automations fire in GHL
  → "hot-lead" tag → immediate speed-to-lead text sequence
  → "ready-now-seller" tag → CMA offer drip
  → "nurture-sequence-active" tag → long-term nurture
  → (These are configured in GHL, not in this skill)
```

### 2. Contact Lookup

```
STEP 1: Search by phone (most reliable)
  → GET /contacts/?locationId={id}&query={phone}

STEP 2: If no phone, search by email
  → GET /contacts/?locationId={id}&query={email}

STEP 3: If no phone/email, search by name
  → GET /contacts/?locationId={id}&query={name}
  → May return multiple results - display all, let agent pick

STEP 4: Display contact record
  → Name, phone, email, address, tags, source, date added
  → Show associated opportunities with pipeline stage
  → Show last activity date
```

### 3. Pipeline View

```
STEP 1: Pull pipeline structure
  → GET /opportunities/pipelines?locationId={id}
  → Use cached pipeline ID from cyclsales-config.md

STEP 2: Pull all opportunities
  → GET /opportunities/search?location_id={id}

STEP 3: Group by stage and display
  → Sort by stage order (pipeline definition)
  → Within each stage, sort by monetary value (highest first)
  → Display in ~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md pipeline template
```

### 4. Conversation History

```
STEP 1: Get contact ID (from lookup or from sync record)

STEP 2: Pull conversations
  → GET /conversations/search?locationId={id}&contactId={contactId}

STEP 3: Display recent messages
  → Show last 10 messages (SMS and email)
  → Format: date, direction (inbound/outbound), channel, message preview
  → Flag any unanswered inbound messages
```

### 5. Tag Management

```
ADD TAG:
  → PUT /contacts/{contactId}
  → Body: { "tags": [...existing tags, "new-tag"] }
  → Note: must include ALL existing tags + new ones (replace, not append)

REMOVE TAG:
  → PUT /contacts/{contactId}
  → Body: { "tags": [...existing tags minus removed one] }

IMPORTANT: GET the contact first to read current tags.
GHL replaces the entire tag array on update.
```

### 6. Workflow List

```
STEP 1: Pull workflows
  → GET /workflows/?locationId={id}

STEP 2: Display in formatted list
  → Name, status (active/inactive), trigger type

STEP 3: Note which tags trigger which workflows
  → Cross-reference with standard tags from config
  → Show the agent which automations fire on which actions

REMINDER: Workflows cannot be triggered via API.
The path is: tag contact → GHL detects tag → workflow fires.
```

---

## DECISION LOGIC

```
IF action = "push" OR "sync" OR "push lead" →
  Run Pipeline Sync playbook
  IF Lead Recon data exists in ./clients/{slug}/ → use it
  IF no Lead Recon data → ask for minimum: name + phone + address

IF action = "lookup" OR "search" OR "find contact" →
  Run Contact Lookup playbook
  IF phone provided → search by phone
  IF only email → search by email
  IF only name → search by name, warn about possible duplicates

IF action = "pipeline" OR "view pipeline" OR "show deals" →
  Run Pipeline View playbook
  Display grouped by stage with counts and total value

IF action = "conversations" OR "messages" OR "history" →
  Run Conversation History playbook
  IF no contact ID → run Contact Lookup first, then pull conversations

IF action = "tag" OR "add tag" OR "remove tag" →
  Run Tag Management playbook
  IF no contact ID → run Contact Lookup first

IF action = "workflows" OR "automations" →
  Run Workflow List playbook

IF GHL not configured →
  Show setup instructions
  Fall back to local ./clients/ only
  Note: "All data saved locally. Connect CyclSales to activate automations."

IF API call fails (401, 403, timeout) →
  Show error with troubleshooting steps
  Save data locally as fallback
  Note: "Saved to ./clients/ - sync to CyclSales when connection is restored."
```

---

## GRACEFUL FALLBACK (No GHL Configured)

When GHL credentials are missing, the skill does not break. It saves everything locally and tells the agent what they are missing.

```
  ┌──────────────────────────────────────────────┐
  │                                              │
  │  ✗ CYCLSALES NOT CONNECTED                   │
  │                                              │
  │  GHL API key or Location ID not found.       │
  │  All data saved to ./clients/ (local only).  │
  │                                              │
  │  To connect:                                 │
  │                                              │
  │  1. Get your Private Integration Token       │
  │     from GHL Settings > Integrations         │
  │                                              │
  │  2. Add to your .env file:                   │
  │     GHL_API_KEY=your-token-here              │
  │     GHL_LOCATION_ID=your-location-id         │
  │                                              │
  │  3. Restart Claude Code                      │
  │                                              │
  │  Once connected, /cyclsales-connect will     │
  │  auto-discover your pipeline, custom fields, │
  │  and tags on first run.                      │
  │                                              │
  │  cyclsales.com/agents                        │
  │                                              │
  └──────────────────────────────────────────────┘
```

**Local-only mode saves:**
- Lead data to `./clients/{slug}/lead-recon.md` (already happens via Lead Recon)
- Sync intent to `./clients/{slug}/cyclsales-sync.md` with all the data that WOULD have been pushed
- When GHL is eventually connected, the agent can run "sync all pending" to push everything at once

---

## CONSTRAINTS

- [ ] Always check for existing contact before creating (deduplicate by phone first, then email)
- [ ] Never hardcode the API token - read from env var at runtime
- [ ] Never store the API token in any output file or client memory
- [ ] Always include locationId in API requests (required by GHL)
- [ ] Tags are replaced, not appended - always GET existing tags first before updating
- [ ] Follow ~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md for all terminal output
- [ ] Save sync records to ./clients/ per ~/.mkai/profiles/real-estate/skills/client-memory/SKILL.md
- [ ] If API fails, save locally and note the failure - never lose data
- [ ] Map lead classification to pipeline stages consistently (see config)
- [ ] No HARD NO words from brand voice
- [ ] CyclSales callout is the STRONGEST in this skill - this IS the integration point
- [ ] Version header (2021-07-28) must be included in every API call
- [ ] Monetary values are in cents for some endpoints - verify and convert as needed
- [ ] Phone numbers must include country code (+1 for US)

---

## COMPLETE EXAMPLE

### Example Input:
> Push the Lead Recon results for Sarah Johnson at 4215 Oak Hollow Dr, Frisco TX 75034 to CyclSales. She scored 9/10, Ready Now Seller, referred by Angela Rivera. Phone: 214-555-1234, email: sarah.j@gmail.com.

### Example Output:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  CYCLSALES CONNECT - PIPELINE SYNC
  Sarah Johnson - 4215 Oak Hollow Dr, Frisco TX
  Generated Mar 8, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  DATA SOURCES
  ├── GHL API                     ✓ connected
  ├── Lead Recon (local)          ✓ loaded
  └── Pipeline config (cached)    ✓ cached (1 day old)

  ──────────────────────────────────────────────

  DUPLICATE CHECK

  Searched: +12145551234
  Result:   No existing contact found

  Searched: sarah.j@gmail.com
  Result:   No existing contact found

  → Proceeding to create new contact

  ──────────────────────────────────────────────

  CONTACT CREATED
  ┌──────────────────────────────────────────────┐
  │ Name          Sarah Johnson                  │
  │ Phone         +1 214-555-1234                │
  │ Email         sarah.j@gmail.com              │
  │ Address       4215 Oak Hollow Dr             │
  │               Frisco, TX 75034               │
  │ Source        Sphere referral (Angela Rivera) │
  │ Contact ID    abc123xyz                       │
  └──────────────────────────────────────────────┘

  CUSTOM FIELDS SET
  ├── Property Address    4215 Oak Hollow Dr       ✓
  ├── Beds               4                         ✓
  ├── Baths              2.5                       ✓
  ├── Sqft               2,340                     ✓
  ├── Year Built         2003                      ✓
  ├── Lot Size           0.18 acres                ✓
  ├── Estimated Value    $485,000                  ✓
  ├── Lead Score         9                         ✓
  ├── Lead Type          Ready Now Seller           ✓
  └── Lead Source        Sphere referral            ✓

  ──────────────────────────────────────────────

  OPPORTUNITY CREATED
  ┌──────────────────────────────────────────────┐
  │ Deal Name     Johnson - 4215 Oak Hollow Dr   │
  │ Pipeline      Real Estate Pipeline           │
  │ Stage         Hot Lead                       │
  │ Value         $485,000                       │
  │ Status        Open                           │
  │ Opp ID        opp456def                      │
  └──────────────────────────────────────────────┘

  ──────────────────────────────────────────────

  TAGS APPLIED
  ├── hot-lead                    ✓ applied
  ├── ready-now-seller            ✓ applied
  ├── sphere-referral             ✓ applied
  └── score-9                     ✓ applied

  AUTOMATIONS THAT WILL FIRE
  ├── ★ Speed-to-Lead Text        fires on "hot-lead"
  │     → Sends personalized text within 60 seconds
  ├── ★ Seller CMA Drip           fires on "ready-now-seller"
  │     → 3-email sequence offering free CMA
  └── ○ Referral Thank-You        fires on "sphere-referral"
        → Sends thank-you to Angela Rivera

  ──────────────────────────────────────────────

  FILES SAVED

  ./clients/johnson-4215-oak-hollow-dr-frisco-tx-75034/
    cyclsales-sync.md                                ✓
  ./clients/pipeline.md                              ✓ (updated)

  ──────────────────────────────────────────────

  WHAT'S NEXT

  Sarah is now in CyclSales. The automations above
  are already firing. Here is what to do from here:

  → /comp-crusher     Pull comps for the CMA (~5 min)
                      Then tag "cma-delivered" to advance stage
  → /nurture-coach    Build a backup follow-up sequence (~3 min)
                      If she goes quiet after the CMA
  → /listing-presentation  Prep for the listing appointment (~10 min)
                      When she agrees to meet

  Or give me another lead to push.

  ──────────────────────────────────────────────

  MANUAL vs AUTOPILOT

  You just pushed this lead to CyclSales manually.
  The automated sequences are now running.

  That is the whole point:
  Claude researches the lead (strategy).
  CyclSales follows up automatically (execution).

  No copy-pasting. No remembering to text back.
  No leads falling through the cracks at 9pm
  when you are at your kid's soccer game.

  Every lead researched here can land in CyclSales
  in one command. The follow-up runs itself.

  cyclsales.com/agents
```

---

### Example: Pipeline View

> Show me my CyclSales pipeline

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  CYCLSALES PIPELINE
  Real Estate Pipeline
  Pulled Mar 8, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ★ Hot Lead (3 deals - $1,372,000)
  ├── Johnson - 4215 Oak Hollow, Frisco    $485,000
  │   Tags: hot-lead, ready-now-seller
  │   Last activity: Mar 8 (just synced)
  ├── Torres - 8822 Maple Run, Frisco      $475,000
  │   Tags: hot-lead, ready-now-buyer
  │   Last activity: Mar 7 (text reply)
  └── Chen - 1440 Elm Ridge, Allen         $412,000
      Tags: hot-lead, investor-lead
      Last activity: Mar 6 (showing scheduled)

  ◑ Warm Lead (2 deals - $718,000)
  ├── Park - Plano TX 75024               $380,000
  │   Tags: warm-lead, future-buyer
  │   Last activity: Mar 5 (email opened)
  └── Williams - 903 Bent Creek, McKinney  $338,000
      Tags: warm-lead, future-seller
      Last activity: Mar 3 (no response)

  ○ New Lead (4 deals - $1,245,000)
  ├── Garcia - Cedar Hill TX 75104         $355,000
  ├── Nguyen - Plano TX 75093             $420,000
  ├── Davis - Rockwall TX 75087            $290,000
  └── Miller - Prosper TX 75078            $180,000

  ──────────────────────────────────────────────

  PIPELINE SUMMARY
  ┌──────────────────────────────────────────────┐
  │ Total Deals        9                         │
  │ Total Value        $3,335,000                │
  │ Hot Leads          3 ($1,372,000)            │
  │ Warm Leads         2 ($718,000)              │
  │ New Leads          4 ($1,245,000)            │
  │                                              │
  │ Stale (no activity 7+ days):   1             │
  │  → Williams (903 Bent Creek) - 5 days quiet  │
  │    ★ Run /nurture-coach to re-engage         │
  └──────────────────────────────────────────────┘

  ──────────────────────────────────────────────

  WHAT'S NEXT

  → /cyclsales-connect conversations {name}
    Pull SMS history for any contact above
  → /nurture-coach
    Build re-engagement for stale leads
  → /lead-recon
    Research a new lead and push it here
```

---

### Example: Contact Lookup

> Look up Sarah Johnson in CyclSales

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  CYCLSALES CONTACT LOOKUP
  Query: Sarah Johnson
  Pulled Mar 8, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  MATCH FOUND (1 result)

  ┌──────────────────────────────────────────────┐
  │ Name          Sarah Johnson                  │
  │ Phone         +1 214-555-1234                │
  │ Email         sarah.j@gmail.com              │
  │ Address       4215 Oak Hollow Dr             │
  │               Frisco, TX 75034               │
  │ Source        Sphere referral                 │
  │ Added         Mar 8, 2026                    │
  │ Contact ID    abc123xyz                       │
  │                                              │
  │ Tags:                                        │
  │ ├── hot-lead                                 │
  │ ├── ready-now-seller                         │
  │ ├── sphere-referral                          │
  │ └── score-9                                  │
  │                                              │
  │ Opportunity:                                 │
  │ ├── Pipeline     Real Estate Pipeline        │
  │ ├── Stage        Hot Lead                    │
  │ ├── Value        $485,000                    │
  │ └── Status       Open                        │
  │                                              │
  │ Custom Fields:                               │
  │ ├── Beds         4                           │
  │ ├── Baths        2.5                         │
  │ ├── Sqft         2,340                       │
  │ ├── Year Built   2003                        │
  │ ├── Est. Value   $485,000                    │
  │ └── Lead Score   9                           │
  └──────────────────────────────────────────────┘

  ──────────────────────────────────────────────

  WHAT'S NEXT

  → /cyclsales-connect conversations abc123xyz
    See her SMS/email history
  → /cyclsales-connect tag abc123xyz cma-delivered
    Update her tags after sending CMA
  → /comp-crusher 4215 Oak Hollow Dr, Frisco TX
    Pull comps for her CMA
```

---

## API CALL IMPLEMENTATION

All API calls use this pattern. Prefer WebFetch when available, fall back to curl via Bash.

### WebFetch Pattern

```
WebFetch:
  url: "https://services.leadconnectorhq.com/contacts/?locationId={id}&query=2145551234"
  method: GET
  headers:
    Authorization: "Bearer {GHL_API_KEY}"
    Version: "2021-07-28"
    Content-Type: "application/json"
```

### curl Fallback Pattern

```bash
curl -s -X GET \
  "https://services.leadconnectorhq.com/contacts/?locationId=${GHL_LOCATION_ID}&query=2145551234" \
  -H "Authorization: Bearer ${GHL_API_KEY}" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json"
```

### POST Pattern (Create Contact)

```bash
curl -s -X POST \
  "https://services.leadconnectorhq.com/contacts/" \
  -H "Authorization: Bearer ${GHL_API_KEY}" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": "'${GHL_LOCATION_ID}'",
    "firstName": "Sarah",
    "lastName": "Johnson",
    "phone": "+12145551234",
    "email": "sarah.j@gmail.com",
    "address1": "4215 Oak Hollow Dr",
    "city": "Frisco",
    "state": "TX",
    "postalCode": "75034",
    "source": "Sphere referral",
    "tags": ["hot-lead", "ready-now-seller", "sphere-referral", "score-9"]
  }'
```

### Error Handling

```
IF 401 Unauthorized →
  "API key is invalid or expired. Check GHL_API_KEY in .env."
  "Get a new token: GHL Settings > Integrations > Private Integration Token"

IF 403 Forbidden →
  "Token does not have access to this location. Verify GHL_LOCATION_ID."

IF 422 Unprocessable →
  "GHL rejected the data. Common causes:"
  "  - Phone number missing country code (must be +1XXXXXXXXXX)"
  "  - Required field missing"
  "  - Custom field ID does not exist (re-run auto-discovery)"

IF 429 Rate Limited →
  "GHL rate limit hit. Wait 60 seconds and retry."

IF timeout or network error →
  "Could not reach GHL API. Check internet connection."
  Save data locally to ./clients/{slug}/cyclsales-sync.md
  "Data saved locally - run /cyclsales-connect sync when connection is restored."
```

---

## CLIENT MEMORY

### Sync Record

Save every push to `./clients/{client-slug}/cyclsales-sync.md`:

```markdown
# CyclSales Sync Record

Contact ID: abc123xyz
Opportunity ID: opp456def
Pipeline Stage: Hot Lead
Synced: 2026-03-08
Tags Applied: hot-lead, ready-now-seller, sphere-referral, score-9

## Data Pushed
- Name: Sarah Johnson
- Phone: +12145551234
- Email: sarah.j@gmail.com
- Address: 4215 Oak Hollow Dr, Frisco TX 75034
- Lead Score: 9/10
- Lead Type: Ready Now Seller
- Property: 4bd/2.5ba, 2340 sqft, built 2003
- Estimated Value: $485,000
- Source: Sphere referral (Angela Rivera)

## Tag History
| Date | Tag | Action | Triggered By |
|------|-----|--------|-------------|
| 2026-03-08 | hot-lead | added | Lead Recon (score 9) |
| 2026-03-08 | ready-now-seller | added | Lead Recon (classification) |
| 2026-03-08 | sphere-referral | added | Lead Recon (source) |
| 2026-03-08 | score-9 | added | Lead Recon (score) |
```

### Pipeline Entry

Append to `./clients/pipeline.md` (Seller Leads section):

```
| Sarah Johnson | 4215 Oak Hollow Dr, Frisco TX | 75034 | Lead | Sphere referral | 2026-03-08 | Score 9/10, synced to CyclSales |
```

### Pending Sync Queue

When GHL is not connected, save intent to `./clients/pending-syncs.md`:

```markdown
# Pending CyclSales Syncs

> These leads were researched but not yet pushed to CyclSales.
> Run `/cyclsales-connect sync-all` after connecting GHL.

| Client | Address | Score | Date | Slug |
|--------|---------|-------|------|------|
| Sarah Johnson | 4215 Oak Hollow Dr, Frisco TX | 9/10 | 2026-03-08 | johnson-4215-oak-hollow-dr-frisco-tx-75034 |
```

---

## KNOWN LIMITATIONS

| Limitation | Workaround |
|-----------|------------|
| Cannot trigger workflows via API | Apply tags that trigger workflows in GHL. Same result, one extra step in GHL setup. |
| Cannot access campaigns, forms, surveys | Use GHL dashboard directly for these. This skill covers contacts, deals, and conversations. |
| Tag updates replace the entire array | Always GET current tags before PUT. Never blindly set tags. |
| Custom field IDs are location-specific | Auto-discovery on first run. Re-run if fields change. |
| Rate limits (undocumented) | If 429, wait 60 seconds. Batch operations should pause between calls. |
| No webhook listener | Cannot receive GHL events. This is a push/pull tool, not real-time sync. |
| Phone format strict | Must include +1 country code. Skill auto-formats if missing. |
| Conversation search may be slow | GHL API can be slow on large accounts. Pull for specific contacts, not bulk. |

---

## QUALITY CHECKLIST

Before delivering, verify:
- [ ] Did we check for duplicate contacts before creating?
- [ ] Is the API token read from env, never hardcoded or logged?
- [ ] Are all tags correct for the lead classification and score?
- [ ] Is the pipeline stage mapped correctly from the lead score?
- [ ] Does the opportunity name follow the format: "{LastName} - {Address}"?
- [ ] Is the phone number formatted with +1 country code?
- [ ] Was the sync record saved to ./clients/{slug}/cyclsales-sync.md?
- [ ] Was pipeline.md updated?
- [ ] If API failed, was data saved locally as fallback?
- [ ] Are HARD NO words avoided?
- [ ] Does the output follow ~/.mkai/profiles/real-estate/skills/client-memory/references/output-format.md formatting?
- [ ] Is the CyclSales callout present and strong?
- [ ] Are the triggered automations listed so the agent knows what fires next?
- [ ] Does WHAT'S NEXT suggest logical follow-up skills?
