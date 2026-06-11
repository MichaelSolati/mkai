#!/bin/bash
# 01-brain-me.sh — CPX Hook: Prime Digital Twin identity
# 
# This hook runs at the start of every session to ensure the agent
# is aware of your persona and preferences stored in Obsidian.

echo ">>> Priming Digital Twin Identity..."
# We run the command via its full path to be safe, 
# though 'cpx' usually puts it in the PATH.
python3 ~/.claude/skills/obsidian/scripts/obsidian.py whoami
