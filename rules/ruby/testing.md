---
paths:
  - "**/*.rb"
  - "**/*.rake"
  - "**/Gemfile"
  - "**/spec/**"
  - "**/test/**"
---
# Ruby Testing

> This file extends [common/testing.md](../common/testing.md) with Ruby-specific content.

## Framework

Use **RSpec** as the primary testing framework. Minitest is supported for projects already using it.

## Running Tests

```bash
bundle exec rspec                        # full suite
bundle exec rspec spec/models/           # model specs only
bundle exec rspec --format documentation # verbose output
bundle exec rails test                   # Minitest
```

## Coverage

```bash
# In spec/spec_helper.rb
require 'simplecov'
SimpleCov.start 'rails'
```

Target: **80% minimum** line coverage.

## Test Organization

```
spec/
  models/
  controllers/
  requests/         # API / integration specs
  services/
  jobs/
  system/           # Capybara end-to-end
  support/          # Shared helpers, factories
  rails_helper.rb
  spec_helper.rb
```

## Reference

See skill: `ruby-testing` for RSpec patterns and factories.
See skill: `rails-tdd` for Rails-specific TDD workflow.
