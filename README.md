# Everything Codex

Codex-first engineering toolkit with reusable:
- agents
- commands
- skills
- rules
- hooks
- MCP templates

This repo started as `everything-claude-code`; reusable assets were translated to Codex workflows and paths.

## Quick Start

```bash
npm install ecc-universal
npx ecc-install typescript
```

Installer output (default target: `codex`):
- `.codex/rules/common/`
- `.codex/rules/<language>/`
- `.codex/agents/`
- `.codex/skills/`
- `.codex/commands/`
- `.codex/contexts/`
- `.codex/mcp-configs/`
- `.codex/AGENTS.ecc.md`
- `.codex/user-AGENTS.ecc.md`

If your project does not already have `AGENTS.md`, installer bootstraps one from the template.

## Install Targets

```bash
# Codex
npx ecc-install typescript

# Multiple languages
npx ecc-install typescript python
```

## Repository Layout

```text
agents/        specialist role prompts
commands/      workflow playbooks
skills/        reusable domain/task playbooks
rules/         common + language-specific constraints
hooks/         automation hooks
contexts/      session context presets
scripts/       validators and helper tooling
docs/codex/    Codex migration and usage docs
examples/      AGENTS templates and examples
```

## Codex Workflow

1. Keep [`AGENTS.md`](AGENTS.md) as your top-level operating contract.
2. Load `rules/common/*` plus your stack-specific rules.
3. Use command playbooks directly:
   - `commands/plan.md`
   - `commands/tdd.md`
   - `commands/code-review.md`
4. Reuse skills from `skills/*/SKILL.md` when task-specific guidance is needed.

## Validation

```bash
node scripts/ci/validate-agents.js
node scripts/ci/validate-commands.js
node scripts/ci/validate-rules.js
node scripts/ci/validate-skills.js
node scripts/ci/validate-hooks.js
node tests/run-all.js
```

## Notes

- The package/repo name remains `everything-claude-code` for continuity.
- Primary docs are now Codex-oriented:
  - [`AGENTS.md`](AGENTS.md)
  - [`CODEX.md`](CODEX.md)
  - [`docs/codex/README.md`](docs/codex/README.md)
