# CODEX.md

This file provides guidance to Codex when working with this repository.

## Project Overview

This repo is a Codex-only config toolkit.

Core components:
- `agents/` - Specialist subagent definitions (planning, review, TDD, security, etc.)
- `commands/` - Reusable workflow prompts
- `skills/` - Domain/workflow playbooks
- `rules/` - Always-on coding/security/testing rules
- `hooks/` - Reusable hook automations (Codex-compatible by convention)
- `scripts/` - Cross-platform helpers and validators

## Codex Usage

- Primary Codex entrypoint is [`AGENTS.md`](/Users/itsaryuk/Projects/platform-engineering/kosmos/everything-claude-code/AGENTS.md).
- Codex migration and setup notes are in [`docs/codex/README.md`](/Users/itsaryuk/Projects/platform-engineering/kosmos/everything-claude-code/docs/codex/README.md).
- Example project/user templates are in:
  - [`examples/AGENTS.md`](/Users/itsaryuk/Projects/platform-engineering/kosmos/everything-claude-code/examples/AGENTS.md)
  - [`examples/user-AGENTS.md`](/Users/itsaryuk/Projects/platform-engineering/kosmos/everything-claude-code/examples/user-AGENTS.md)

## Validation

Run before submitting changes:

```bash
node scripts/ci/validate-agents.js
node scripts/ci/validate-commands.js
node scripts/ci/validate-rules.js
node scripts/ci/validate-skills.js
node scripts/ci/validate-hooks.js
node tests/run-all.js
```
