---
description: Initialize or verify the Obsidian vault integration and Digital Twin identity document.
allowed-tools:
  - obsidian
  - Bash
  - AskUserQuestion
---

# /brain-setup — Digital Twin Setup

This command ensures your Obsidian vault is correctly connected and your identity document is initialized.

## Script

```bash
python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py setup
```

## Workflow

1.  **Check Connection**: Run the `/brain-setup` command.
2.  **Handle Missing Identity**:
    *   If the identity document (e.g., `identity/me.md`) is missing, the script will warn you.
    *   Ask the user: "I see your identity document is missing. Should we create it now? I'll ask you a few questions to build your initial persona."
    *   If yes, ask:
        1. "What is your primary professional role or title?"
        2. "What are 3-5 core technical or personal interests?"
        3. "What are your top 2 communication preferences (e.g., direct, detailed, casual)?"
    *   Run the `init` command to create the doc:
        ```bash
        python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py init "identity/me.md" --type note --title "My Digital Twin" --body "## Role\n[Role]\n\n## Interests\n[Interests]\n\n## Preferences\n[Preferences]"
        ```
3.  **Completion**: Confirm the vault is ready for use.
