# ECC for Codex

This repository is now maintained as a Codex-first toolkit.

## Quick Start

```bash
npm install ecc-universal
npx ecc-install typescript
```

Default install (`ecc-install`) provisions `.codex/` in your project:
- `.codex/rules/` (common + selected language rules)
- `.codex/agents/`
- `.codex/skills/`
- `.codex/commands/`
- `.codex/contexts/`
- `.codex/mcp-configs/`
- `.codex/AGENTS.ecc.md` and `.codex/user-AGENTS.ecc.md` templates

If `AGENTS.md` is missing, installer creates it from the ECC template.

## Mapping Legacy Assets

| ECC Concept | Codex Usage |
|---|---|
| Project root instruction file | `AGENTS.md` |
| `agents/*.md` | Role prompts to emulate in Codex |
| `commands/*.md` | Workflow playbooks used as direct prompts |
| `skills/*/SKILL.md` | Reusable task playbooks |
| `rules/*` | Baseline constraints for coding/review |
| Hook scripts | Optional automation layer |

## Recommended Workflow

1. Start with `AGENTS.md` + common rules.
2. Load language-specific rules for current stack.
3. Use `commands/plan.md`, `commands/tdd.md`, and `commands/code-review.md` as repeatable operating loops.
4. Run validators before publishing changes.

## Validation

```bash
node scripts/ci/validate-agents.js
node scripts/ci/validate-commands.js
node scripts/ci/validate-rules.js
node scripts/ci/validate-skills.js
node scripts/ci/validate-hooks.js
node tests/run-all.js
```
