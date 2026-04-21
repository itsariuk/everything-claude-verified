---
paths:
  - "**/*.rb"
  - "**/app/**"
  - "**/config/**"
---
# Ruby Security

> This file extends [common/security.md](../common/security.md) with Ruby-specific content.

## Security Scanning

```bash
bundle exec brakeman -q          # Rails static analysis
bundle exec bundle-audit check   # Gem CVE check
bundle exec bundler-audit update # Refresh advisory DB first
```

## Secret Management

Use Rails credentials — never hardcode secrets:

```bash
rails credentials:edit           # Edit encrypted credentials
rails credentials:show           # View current credentials
```

Access in code:

```ruby
Rails.application.credentials.dig(:aws, :access_key_id)
```

Fallback to environment variables for non-Rails contexts:

```ruby
api_key = ENV.fetch("API_KEY") { raise "API_KEY is required" }
```

## SQL Injection Prevention

```ruby
# SAFE — parameterised
User.where(email: params[:email])
User.where("email = ?", params[:email])

# UNSAFE — never interpolate user input
User.where("email = '#{params[:email]}'")  # VULNERABLE
```

## Mass Assignment

Always use strong parameters — never pass raw `params` to ActiveRecord:

```ruby
# SAFE
def user_params
  params.expect(user: [:name, :email])
end

# UNSAFE
User.create(params[:user])  # VULNERABLE
```

## Reference

See skill: `rails-security` for comprehensive Rails security hardening.
