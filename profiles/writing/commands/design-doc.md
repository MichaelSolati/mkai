---
description: Draft a design document in your voice
argument-hint: <system or feature to design>
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - Write
  - Edit
---

# /design-doc — Write a Design Document in Your Voice

Load the **my-voice** skill from `~/.mkai/profiles/writing/skills/my-voice/SKILL.md`. It will instruct you to load your voice profile from Obsidian via `python3 ~/.mkai/profiles/obsidian/skills/obsidian/scripts/obsidian.py read identity/writing-voice.md`. If the vault file doesn't exist, tell the user to run `/voice-setup` first.

## Your Task

Write a design document for the system or feature described in `$ARGUMENTS`. If the user doesn't provide enough context, ask for:

- What system/feature is being designed?
- What problem does it solve?
- Who are the stakeholders/reviewers?
- Are there any known constraints?

## Design Document Structure

Follow this structure. Every section is required unless explicitly marked optional.

### 1. Header / Metadata

```markdown
# [Design Title]

**Author:** [Pull name from voice profile Core Identity, or ask the user]
**Status:** Draft
**Last Updated:** [today's date]
**Reviewers:** [ask if not provided]
**Related Docs:** [if any]
```

### 2. Context & Problem Statement

- Explain the problem so someone *not on your team* can understand it
- Ground it in user or business impact — not just technical irritation
- 2-4 paragraphs, narrative form (not bullets)

### 3. Goals

- Specific and measurable where possible
- Numbered list, 3-5 goals
- Each goal should be verifiable — "how would we know we achieved this?"

### 4. Non-Goals

- At least 3 non-goals
- These prevent scope creep — explicitly state what this design does NOT address
- Frame as "This design does not..." or "Out of scope:"

### 5. Proposed Solution / Design

- This is the core section — give it the space it needs
- Use narrative prose, not just bullet lists
- Include architecture diagrams (describe them in text or suggest Mermaid/ASCII)
- Break into subsections with H3 headings for complex designs
- Walk through the key flows / interactions
- Call out any assumptions explicitly

### 6. Alternatives Considered

- Engage genuinely with the 2-3 strongest alternatives
- Don't set up straw men — present each alternative fairly
- For each: brief description, pros, cons, and why it wasn't chosen
- Use a consistent format (table or subsections)

### 7. Trade-offs & Risks

- Name the axes explicitly (latency vs. cost, consistency vs. availability, etc.)
- Quantify where possible — "adds ~50ms p99 latency" not "slightly slower"
- Connect each trade-off back to the goals
- Separate known risks from open questions

### 8. Milestones & Rollout Plan

- Phase the work into concrete milestones
- Include rollback strategy for risky changes
- Specify feature flags, gradual rollout percentages, or canary strategy if applicable

### 9. Open Questions

- Numbered for easy reference in review comments
- Each question should indicate who might have the answer or what would unblock it

### 10. Appendix (Optional)

- Detailed calculations, data models, API schemas
- Reference material that supports the design but would interrupt the narrative

## Voice Dial: ~60%

This is a professional document — personality is present but restrained:

- **Opinions:** State them directly. "I recommend X because..." / "We should avoid Y." No consensus-seeking mush.
- **Humor:** Rare and strategic. One well-placed aside is fine. Don't force it.
- **Vocabulary:** Still conversational — "use" not "utilize", "help" not "facilitate" — but avoid slang.
- **Sentence rhythm:** More uniform than blog posts. Still vary length, but lean toward clear, medium-length sentences.
- **Emphasis:** Moderate use of bold for key terms. Light on other emphasis tools.
- **Quantification:** Heavy. Design docs live and die on specifics.
- **Pop culture references:** Only if the team culture clearly welcomes them. When in doubt, leave them out.
- **"I recommend" / "we believe":** Use these for judgment calls. Don't hide behind passive voice.

## Design Doc Anti-Patterns to Avoid

- **The Novel:** If it's over 10 pages, cut ruthlessly. Long isn't thorough — it's unread.
- **Straw Man Alternatives:** If an alternative is obviously terrible, don't include it. Engage with real contenders.
- **Missing Non-Goals:** No non-goals = guaranteed scope creep.
- **Solution-First Writing:** Don't jump to the design before establishing context and goals.
- **No Diagrams:** Architecture is spatial. Text is linear. You need both.
- **The Spec Masquerading as a Design Doc:** A design doc explains *why*, not just *what*.
- **Consensus-Seeking Mush:** If you recommend something, say so. Don't hedge every sentence.

## Before Finishing

Check:

- [ ] Someone outside the team can understand the Context section
- [ ] Goals are specific and measurable
- [ ] At least 3 non-goals listed
- [ ] Alternatives are genuine, not straw men
- [ ] Trade-offs are quantified
- [ ] Open questions are numbered and actionable
- [ ] No banned AI vocabulary
- [ ] Anti-slop phrases and structures checked (respecting voice profile overrides)
- [ ] Voice is present but professional — ~60% personality dial
- [ ] Recommendations are stated directly, not hedged

After writing the draft, invoke the **style-reviewer** agent to check for AI-isms and voice drift.
