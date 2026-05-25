# Output Format Standards

## Terminal-Native Display

All skill output uses terminal-native formatting for readability:

### Section Headers
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📊 SECTION TITLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Data Cards
```
┌─────────────────────────────────────────┐
│  Property: 123 Main St                  │
│  Price: $450,000 | Beds: 3 | Baths: 2  │
│  Status: Active | DOM: 12              │
└─────────────────────────────────────────┘
```

### Pipeline Tables
```
┌──────────┬─────────────┬──────────┬─────────┐
│ Client   │ Stage       │ Next Act │ Priority│
├──────────┼─────────────┼──────────┼─────────┤
│ J. Smith │ Showing     │ Follow-up│ HIGH    │
└──────────┴─────────────┴──────────┴─────────┘
```

### Status Indicators
- 🟢 Active/On Track
- 🟡 Needs Attention
- 🔴 Urgent/Overdue
- ⚪ Inactive/Paused

### Error Template
```
⚠️  ERROR: [error type]
━━━━━━━━━━━━━━━━━━━━━━
Issue: [what went wrong]
Required: [what's needed]
Action: [what user should do]
```

### Data Source Indicators
Always show where data comes from:
- `[CACHED 3d ago]` - from local files
- `[LIVE]` - freshly gathered
- `[USER INPUT]` - provided by user
- `[ESTIMATED]` - calculated/inferred

### Confidence Levels
For market estimates and valuations:
- `HIGH` - multiple recent comps, strong correlation
- `MEDIUM` - limited data or older comps
- `LOW` - insufficient data, wide range
