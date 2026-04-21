---
name: rails-security
description: Rails security hardening — strong parameters, CSRF protection, SQL injection prevention, Brakeman scanning, credentials management, Devise hardening, and production security headers. Based on official Rails Security Guide.
origin: ECC
---

# Rails Security

Security hardening for Rails applications. Based on the [Rails Security Guide](https://guides.rubyonrails.org/security.html).

## When to Activate

- Adding authentication or authorization
- Accepting user input or file uploads
- Reviewing a Rails app before deployment
- Adding new API endpoints

## Strong Parameters (Mass Assignment)

Always whitelist attributes explicitly. Rails 8 uses `params.expect`:

```ruby
# Rails 8 — params.expect (preferred)
def user_params
  params.expect(user: [:name, :email, :password])
end

# Rails 7 — params.require.permit
def user_params
  params.require(:user).permit(:name, :email, :password)
end

# NEVER pass raw params to ActiveRecord
User.create(params[:user])           # VULNERABLE
User.update(id, params[:user])       # VULNERABLE
```

## SQL Injection Prevention

```ruby
# SAFE — parameterised queries
User.where(email: params[:email])
User.where("role = ?", params[:role])
User.where("created_at > :date", date: params[:from])

# UNSAFE — string interpolation
User.where("email = '#{params[:email]}'")   # VULNERABLE
User.order("#{params[:sort]} DESC")         # VULNERABLE — sanitize with:
User.order(Arel.sql("name ASC"))            # OK only for static strings
```

## CSRF Protection

Enabled by default in `ApplicationController`:

```ruby
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception  # raises InvalidAuthenticityToken
end

# API controllers — use :null_session (stateless)
class Api::V1::BaseController < ActionController::API
  # ActionController::API skips CSRF automatically
end
```

## Production Security Headers

```ruby
# config/environments/production.rb
config.force_ssl = true

# config/application.rb
config.action_dispatch.default_headers = {
  "X-Frame-Options"        => "SAMEORIGIN",
  "X-XSS-Protection"       => "0",           # Modern browsers handle this
  "X-Content-Type-Options" => "nosniff",
  "X-Permitted-Cross-Domain-Policies" => "none",
  "Referrer-Policy"        => "strict-origin-when-cross-origin",
  "Content-Security-Policy" => "default-src 'self'"
}
```

## Credentials and Secrets

```bash
# Never hardcode secrets — use encrypted credentials
rails credentials:edit

# Access
Rails.application.credentials.dig(:stripe, :secret_key)

# Environment variable fallback
ENV.fetch("DATABASE_URL") { raise "DATABASE_URL is required" }
```

Never commit `.env`, `config/secrets.yml` unencrypted, or `config/master.key`.

## Authentication (Devise Hardening)

```ruby
# config/initializers/devise.rb
Devise.setup do |config|
  config.password_length = 12..128
  config.lock_strategy   = :failed_attempts
  config.maximum_attempts = 5
  config.unlock_strategy  = :time
  config.unlock_in        = 1.hour
  config.timeout_in       = 30.minutes
  config.pepper           = Rails.application.credentials.devise_pepper!
end
```

## Authorization (Pundit)

```ruby
class OrderPolicy < ApplicationPolicy
  def show?   = record.user == user || user.admin?
  def update? = record.user == user
  def destroy? = user.admin?
end

class OrdersController < ApplicationController
  before_action :authenticate_user!

  def show
    @order = Order.find(params[:id])
    authorize @order
  end
end
```

## File Upload Security

```ruby
# Validate content type via ActiveStorage or manual check
ALLOWED_TYPES = %w[image/jpeg image/png application/pdf].freeze

def validate_attachment(attachment)
  unless ALLOWED_TYPES.include?(attachment.content_type)
    errors.add(:file, "type not allowed")
  end
  if attachment.byte_size > 10.megabytes
    errors.add(:file, "is too large (max 10MB)")
  end
end
```

## Brakeman Workflow

```bash
gem install brakeman           # or add to Gemfile :development
bundle exec brakeman -q        # quiet — only findings
bundle exec brakeman --format html -o brakeman_report.html
```

High-confidence findings must be fixed before merging.

## Quick Security Checklist

| Check | Command / Setting |
|-------|------------------|
| Scan for vulns | `brakeman -q` |
| Gem CVEs | `bundle exec bundle-audit check` |
| Strong params | `params.expect(...)` on every action |
| No SQL interpolation | Grep for `"where.*#\{` |
| Secrets in credentials | `rails credentials:show` |
| `force_ssl` on | `config.force_ssl = true` |
| Auth on controllers | `before_action :authenticate_user!` |
| Authorise records | `authorize @record` (Pundit) |
