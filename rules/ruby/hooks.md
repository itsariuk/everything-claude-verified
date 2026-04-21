---
paths:
  - "**/*.rb"
  - "**/*.rake"
---
# Ruby Hooks

> This file extends [common/hooks.md](../common/hooks.md) with Ruby-specific content.

## PostToolUse — Auto-format on edit

After editing `.rb` files, run RuboCop auto-correction:

```bash
bundle exec rubocop -A <changed_file>
```

Or with StandardRB:

```bash
bundle exec standardrb --fix <changed_file>
```

## PostToolUse — Type checking (optional)

If the project uses Sorbet or Steep:

```bash
bundle exec srb tc          # Sorbet
bundle exec steep check     # Steep
```

## Code Smell Reminders

Warn on:
- `puts` / `p` in `app/` code — use `Rails.logger` instead
- `binding.pry` or `debugger` left in committed code
- `rescue Exception` — rescue `StandardError` or a specific subclass
- String interpolation in SQL: `where("name = '#{input}'")` → use `where(name: input)`
