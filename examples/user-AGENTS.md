# User-Level AGENTS.md Example

This is an example user-level `AGENTS.md` file for Codex users.

User-level configs apply globally across all projects. Use for:
- Personal coding preferences
- Universal rules you always want enforced
- Links to modular rules and skills

---

## Core Philosophy

Use specialist workflows for complex tasks.

**Key Principles:**
1. **Specialist-first**: emulate dedicated roles for planning/review/security
2. **Parallel execution**: run independent checks in parallel when possible
3. **Plan before execute**: define implementation steps before edits
4. **Test-driven**: write tests before implementation
5. **Security-first**: never compromise on security

---

## Modular Rules

Detailed guidelines can be loaded from your Codex config workspace:

| Rule File | Contents |
|-----------|----------|
| `.codex/rules/common/security.md` | Security checks, secret management |
| `.codex/rules/common/coding-style.md` | Immutability, file organization, error handling |
| `.codex/rules/common/testing.md` | TDD workflow, 80% coverage requirement |
| `.codex/rules/common/git-workflow.md` | Commit format, PR workflow |
| `.codex/rules/common/agents.md` | Agent orchestration guidance |
| `.codex/rules/common/patterns.md` | API and repository patterns |
| `.codex/rules/common/performance.md` | Context and model efficiency guidance |

---

## Available Specialist Profiles

Located in `.codex/agents/`:

| Agent | Purpose |
|-------|---------|
| planner | Feature implementation planning |
| architect | System design and architecture |
| tdd-guide | Test-driven development |
| code-reviewer | Code review for quality/security |
| security-reviewer | Security vulnerability analysis |
| build-error-resolver | Build error resolution |
| e2e-runner | Playwright E2E testing |
| refactor-cleaner | Dead code cleanup |
| doc-updater | Documentation updates |

---

## Personal Preferences

### Privacy
- Always redact logs; never paste secrets (API keys/tokens/passwords/JWTs)
- Review output before sharing and remove sensitive data

### Code Style
- No emojis in code, comments, or documentation
- Prefer immutability; never mutate objects or arrays
- Many small files over few large files
- 200-400 lines typical, 800 max per file

### Git
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Always test locally before committing
- Small, focused commits

### Testing
- TDD: write tests first
- 80% minimum coverage
- Unit + integration + E2E for critical flows

---

## Success Metrics

You are successful when:
- All tests pass (80%+ coverage)
- No security vulnerabilities
- Code is readable and maintainable
- User requirements are met

---

**Philosophy**: specialist workflows, parallel execution, plan before action, test before code, security always.
