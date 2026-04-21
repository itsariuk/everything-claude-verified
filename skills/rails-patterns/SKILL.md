---
name: rails-patterns
description: Rails 7.1+ architecture patterns — project layout, ActiveRecord best practices, controllers, service layers, jobs, caching, and API design. Based on official Rails guides.
origin: ECC
---

# Rails Patterns

Production-grade Rails architecture patterns.

## When to Activate

- Building or reviewing Rails applications (7.1+)
- Designing models, controllers, or service layers
- Working with ActiveRecord associations, scopes, callbacks
- Setting up background jobs, caching, or API endpoints

## Project Layout

```
app/
  controllers/
    api/
      v1/
        base_controller.rb
        users_controller.rb
    concerns/
    application_controller.rb
  models/
    concerns/
  services/       # Business logic — plain Ruby objects
  jobs/           # Active Job subclasses
  mailers/
  serializers/    # jbuilder views or active_model_serializers
config/
  routes.rb
  credentials.yml.enc
db/
  migrate/
  schema.rb
spec/ (or test/)
```

## ActiveRecord Patterns

### Scopes Over Class Methods

```ruby
class Order < ApplicationRecord
  scope :recent,    -> { where("created_at > ?", 30.days.ago) }
  scope :pending,   -> { where(status: :pending) }
  scope :for_user,  ->(user) { where(user: user) }

  # Chain scopes
  # Order.pending.recent.for_user(current_user)
end
```

### Associations and N+1 Prevention

```ruby
# WRONG — N+1
Order.all.each { |o| puts o.user.name }

# CORRECT — eager load
Order.includes(:user).each { |o| puts o.user.name }

# includes vs joins:
# includes — loads associations in memory (use when rendering association data)
# joins    — SQL JOIN only (use when filtering, not rendering)
Order.joins(:user).where(users: { active: true })
```

### Callbacks — Use Sparingly

```ruby
# Acceptable: data normalisation before save
class User < ApplicationRecord
  before_validation { self.email = email.to_s.downcase.strip }
end

# Avoid: side effects in callbacks (emails, external calls)
# Use service objects or Active Job instead
```

### Migrations

```ruby
# Always add index when adding a foreign key
add_reference :orders, :user, null: false, foreign_key: true
# ^ automatically adds index: true

# Non-null columns: provide a default or do it in 3 steps
add_column :orders, :status, :string, null: false, default: "pending"

# Large tables: avoid locking
add_index :orders, :status, algorithm: :concurrently  # PostgreSQL
```

## Controller Patterns

```ruby
class Api::V1::OrdersController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :set_order, only: %i[show update destroy]

  def create
    order = Orders::Create.new(order_params, user: current_user).call
    render json: order, status: :created
  rescue Orders::InsufficientStockError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def set_order
    @order = current_user.orders.find(params[:id])
  end

  def order_params
    # Rails 8 — params.expect prevents scalar values being passed as hashes
    params.expect(order: [:item_id, :quantity, :notes])
  end
end
```

## Service Layer

```ruby
# app/services/orders/create.rb
module Orders
  class Create
    def initialize(params, user:)
      @params = params
      @user   = user
    end

    def call
      ActiveRecord::Base.transaction do
        order = @user.orders.create!(@params)
        inventory.reserve!(order)
        order
      end
    end

    private

    def inventory = Inventory.new
  end
end
```

## Background Jobs

```ruby
class WelcomeEmailJob < ApplicationJob
  queue_as :default
  retry_on Net::TimeoutError, wait: :polynomially_longer, attempts: 5

  def perform(user_id)
    user = User.find(user_id)
    UserMailer.welcome(user).deliver_now
  end
end

# Enqueue
WelcomeEmailJob.perform_later(user.id)
WelcomeEmailJob.set(wait: 5.minutes).perform_later(user.id)
```

## Caching

```ruby
# Fragment caching in views
<% cache [@order, current_user] do %>
  <%= render @order %>
<% end %>

# Low-level caching
Rails.cache.fetch("user/#{user.id}/stats", expires_in: 1.hour) do
  UserStatsCalculator.new(user).call
end

# Counter cache
belongs_to :user, counter_cache: true
```

## API Design

```ruby
# config/routes.rb
namespace :api do
  namespace :v1 do
    resources :orders, only: %i[index show create update destroy]
    resources :users, only: %i[show update]
  end
end

# Return consistent JSON envelopes
def render_success(data, status: :ok)
  render json: { success: true, data: data }, status: status
end

def render_error(message, status: :unprocessable_entity)
  render json: { success: false, error: message }, status: status
end
```

## Quick Reference

| Pattern | Use When |
|---------|----------|
| Scopes | Reusable query predicates |
| `includes` | Rendering association data |
| `joins` | Filtering by association |
| Service objects | Business logic > 3 lines |
| `params.expect` | Permit attributes (Rails 8) |
| Active Job | Async, retryable work |
| `Rails.cache.fetch` | Memoize expensive calls |
