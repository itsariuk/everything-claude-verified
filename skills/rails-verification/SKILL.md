---
name: rails-verification
description: Pre-merge verification loop for Rails projects — RuboCop, Brakeman, bundle-audit, RSpec with SimpleCov, migration status, and Zeitwerk check. Run before every PR.
origin: ECC
---

# Rails Verification Loop

Pre-merge checklist for Rails applications.

## When to Activate

- Before opening or merging a PR
- After a large refactor or dependency update
- When CI is failing and you need to reproduce locally

## Full Verification Sequence

```bash
# 1. Lint
bundle exec rubocop

# 2. Security scan
bundle exec brakeman -q
bundle exec bundle-audit check

# 3. Tests with coverage
bundle exec rspec

# 4. Migration status — catch pending migrations
bundle exec rails db:migrate:status | grep down && echo "PENDING MIGRATIONS" || echo "OK"

# 5. Zeitwerk autoload check
bundle exec rails zeitwerk:check

# 6. (Optional) Bullet N+1 report
# Add to config/environments/test.rb:
# Bullet.enable = true
# Bullet.raise = true
```

Run all at once:

```bash
bundle exec rubocop && \
bundle exec brakeman -q && \
bundle exec bundle-audit check && \
bundle exec rspec && \
bundle exec rails db:migrate:status && \
bundle exec rails zeitwerk:check
```

## Coverage Gate

```ruby
# spec/spec_helper.rb — enforced by SimpleCov
SimpleCov.start 'rails' do
  minimum_coverage 80
  refuse_coverage_drop  # fails if coverage drops vs last run
end
```

## CI Configuration (GitHub Actions)

```yaml
name: Rails CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with:
          bundler-cache: true
      - run: bundle exec rails db:create db:migrate
      - run: bundle exec rubocop
      - run: bundle exec brakeman -q
      - run: bundle exec rspec
```

## Common Failure Patterns

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `NameError: uninitialized constant` | Zeitwerk naming mismatch | Rename file to match class name |
| `PendingMigrationError` | Forgot to run migrations | `rails db:migrate` |
| `Gem::ConflictError` | Version conflict | `bundle update <gem>` |
| Coverage drops below 80% | New code without tests | Add specs before merging |
| Brakeman HIGH finding | Security issue | Fix before merging |
