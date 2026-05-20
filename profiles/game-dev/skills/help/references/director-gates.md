# Director Gates Reference

## Gate Check Pattern

Director gates are quality checkpoints where specialized director agents review work before it proceeds. The system operates in three modes:

### Modes
- **Full** (3+ team members active): All relevant directors review. Spawn each director as a parallel sub-agent.
- **Lean** (2 team members): Only the primary director reviews. Skip secondary gates.
- **Solo** (1 person): Self-review against the gate criteria. No agent spawning - just verify the checklist inline.

### How to determine mode
Check how many people are actively contributing to the project. If unclear, default to **Solo**.

## Gate Registry

| Gate ID | Director | Trigger | What It Checks |
|---------|----------|---------|----------------|
| CD-PILLARS | Creative Director | Design docs, brainstorms | Aligns with creative vision and game pillars |
| CD-GDD-ALIGN | Creative Director | GDD changes | Game design doc consistency |
| CD-PLAYTEST | Creative Director | Playtest reports | Findings align with design intent |
| CD-SYSTEMS | Creative Director | Systems design | System supports creative goals |
| TD-FEASIBILITY | Technical Director | Architecture proposals | Technical feasibility and risk |
| TD-ARCHITECTURE | Technical Director | Architecture decisions | Architectural soundness |
| TD-SYSTEM-BOUNDARY | Technical Director | System maps | Clean system boundaries |
| TD-ADR | Technical Director | ADR creation | Decision quality and completeness |
| TD-CHANGE-IMPACT | Technical Director | Design changes | Impact assessment accuracy |
| TD-MANIFEST | Technical Director | Control manifests | Input mapping completeness |
| PR-SCOPE | Producer | Epic/story creation | Scope is achievable |
| PR-EPIC | Producer | Epic creation | Epic is well-defined |
| PR-SPRINT | Producer | Sprint plans | Sprint is realistic |
| PR-MILESTONE | Producer | Milestone reviews | Milestone criteria met |
| AD-ART-BIBLE | Art Director | Art bible creation | Visual consistency |
| QL-STORY-READY | QA Lead | Story readiness | Testable acceptance criteria |
| QL-TEST-COVERAGE | QA Lead | Story completion | Adequate test coverage |
| LP-FEASIBILITY | Lead Programmer | Architecture proposals | Implementation feasibility |
| LP-CODE-REVIEW | Lead Programmer | Story completion | Code quality |

## Gate Check Execution

When a skill says "Check gate X (see director-gates.md)":

1. Determine current mode (Full/Lean/Solo)
2. If **Solo**: Review the gate's criteria yourself inline. List pass/fail for each criterion.
3. If **Lean**: Spawn only the primary director agent listed for that gate.
4. If **Full**: Spawn the director agent plus any secondary reviewers.

### Gate Output Format
```
## Gate: [GATE-ID] - [PASS/FAIL/CONDITIONAL]
- Reviewer: [Director name] (mode: [full/lean/solo])
- [✓] Criterion 1
- [✗] Criterion 2 - [reason]
- Recommendation: [proceed / revise / block]
```
