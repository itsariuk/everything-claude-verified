---
paths:
  - "**/*.rb"
  - "**/*.rake"
  - "**/Gemfile"
  - "**/Rakefile"
  - "**/*.ru"
  - "**/*.gemspec"
  - "**/*.erb"
---
# Ruby Coding Style

> This file extends [common/coding-style.md](../common/coding-style.md) with Ruby-specific content.

## Standards

- Follow the [Ruby Style Guide](https://rubystyle.guide) enforced via **RuboCop**
- Add `# frozen_string_literal: true` to every `.rb` file
- Two-space indentation — no tabs

## Immutability

Prefer immutable value objects:

```ruby
# Ruby 3.2+ — preferred
Point = Data.define(:x, :y)
point = Point.new(x: 1, y: 2)

# Struct alternative
User = Struct.new(:name, :email, keyword_init: true).freeze
```

Avoid mutating objects passed as arguments. Return new values instead.

## Formatting

- **RuboCop** for linting: `bundle exec rubocop`
- **RuboCop -A** for auto-correction: `bundle exec rubocop -A`
- **StandardRB** as an opinionated zero-config alternative: `bundle exec standardrb`

## Naming

- Classes and modules: `PascalCase`
- Methods and variables: `snake_case`
- Constants: `SCREAMING_SNAKE_CASE`
- Predicates end with `?`; destructive methods end with `!`

## Reference

See skill: `ruby-patterns` for comprehensive Ruby idioms and patterns.
