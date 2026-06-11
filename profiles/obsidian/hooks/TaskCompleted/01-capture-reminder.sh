#!/bin/bash
# 01-capture-reminder.sh — CPX Hook: Remind agent to save knowledge
# 
# This hook runs after a task is completed to remind the agent
# to document any significant decisions or patterns in Obsidian.

echo ">>> Task Completed. Checking for documentable knowledge..."
# We use a simple prompt-style reminder. 
# Claude Code hooks can return text that the agent sees.
echo "CRITICAL: Did you make any technical decisions or discover reusable patterns during this task? If so, you MUST document them now using the 'brain' command before proceeding."
