---
description: Draft a blog post in your voice
argument-hint: <topic or title>
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - Write
  - Edit
---

# /blog — Write a Blog Post in Your Voice

Load the **my-voice** skill from `~/.mkai/profiles/writing/skills/my-voice/SKILL.md`. It will instruct you to load your voice profile from Obsidian via `python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read identity/writing-voice.md`. If the vault file doesn't exist, tell the user to run `/voice-setup` first.

## Your Task

Write a blog post on the topic provided in `$ARGUMENTS`. If the user doesn't provide a topic, ask for one.

## Blog Post Structure

Follow this structural template, adapting the specific sections to fit the topic:

1. **Opening Hook** (1-2 paragraphs)
   - Use one of the opening patterns from the voice profile: personal anecdote, strong declarative, or relatable pain point
   - NEVER open with a definition, industry platitude, or throat-clearing preamble
   - Get the reader invested in the first two sentences

2. **Body Sections** (3-6 sections with H2 headings)
   - Choose the right blog structure for the topic:
     - **Problem-Solution:** Context > Why it's hard > Solution step by step > Lessons/caveats
     - **Tutorial/How-To:** What we're building > Prerequisites > Step-by-step > Final result > Next steps
     - **Opinion/Argument:** Conventional wisdom > Why you disagree > Evidence > Anticipated objections > Conclusion
     - **Case Study/Post-Mortem:** Background > What happened > What was tried > Outcome/metrics > Lessons
     - **Explainer/Deep Dive:** Why this matters > Mental model > Layer-by-layer > Misconceptions > Summary
   - Use narrative flow between sections — not just bullet lists
   - Include code snippets where relevant, with brief explanations
   - Quantify claims with specific numbers
   - Use rhetorical questions to transition between sections

3. **Closing Section** (use the user's preferred closing heading from voice profile, or "Wrapping Up" as default)
   - Brief, specific conclusion — not a rehash of everything above
   - No "Key Takeaways" bullet lists
   - End with a call-to-action: link to code, social follow, or related reading
   - Include a personality moment (joke, aside, callback to the opening)

## Voice Dial: 100%

This is a blog post — full personality mode:

- Humor: frequent — use the user's humor style from voice profile
- Emphasis: heavy — use the user's preferred emphasis tools from voice profile
- Sentence rhythm: full range — short punchy fragments mixed with longer explanations
- Rhetorical questions: use as section transitions
- "I" and "you": direct address throughout

## Length Target

1000-3000 words. Adjust based on topic complexity — don't pad to hit a word count, and don't cut short if the topic needs depth.

## Before Finishing

Run through the Anti-Patterns Checklist from the voice skill:

- No banned vocabulary
- Anti-slop phrases checked (respecting voice profile overrides)
- Anti-slop structures checked (respecting voice profile overrides)
- Hook opening, not a definition
- Specific closing, not a generic summary
- Varied sentence lengths
- At least one humor moment
- Quantified claims where possible
- Direct reader address
- No sycophantic or hedging language

After writing the draft, invoke the **style-reviewer** agent to check for AI-isms and voice drift.
