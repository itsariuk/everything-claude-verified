# AGENTS.md

Codex operating guide for this repository.

## Mission

Maintain this repository as a reusable AI engineering toolkit with first-class support for:
- Codex (runtime and workflow)

## Source of Truth

Treat these as canonical:
- `agents/`
- `commands/`
- `skills/`
- `rules/`
- `hooks/`
- `scripts/`

Platform adapters should stay aligned with canonical content:
- `docs/codex/`
- examples in `examples/`

## Codex Mapping

When working in Codex:
- Use `rules/common/*` as baseline constraints.
- Add language-specific rules from `rules/typescript`, `rules/python`, `rules/golang` based on the project stack.
- Treat files in `agents/` as specialist review/planning personas to emulate directly.
- Treat files in `commands/` as prompt templates/workflows.
- Treat files in `skills/*/SKILL.md` as task-specific playbooks loaded on demand.

## Workflow Requirements

For substantial changes:
1. Plan changes before editing.
2. Update Codex docs/templates if behavior changes.
3. Run validation and tests:
   - `node scripts/ci/validate-agents.js`
   - `node scripts/ci/validate-commands.js`
   - `node scripts/ci/validate-rules.js`
   - `node scripts/ci/validate-skills.js`
   - `node scripts/ci/validate-hooks.js`
   - `node tests/run-all.js`

## Quality Bar

- Prefer minimal, compatible changes over broad rewrites.
- Keep docs accurate to actual behavior (no aspirational claims).
- Do not remove or weaken security guidance in `rules/common/security.md`.
