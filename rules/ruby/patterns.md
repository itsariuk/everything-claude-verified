---
paths:
  - "**/*.rb"
  - "**/app/services/**"
  - "**/app/models/**"
  - "**/app/controllers/**"
---
# Ruby Patterns

> This file extends [common/patterns.md](../common/patterns.md) with Ruby-specific content.

## Service Objects

Extract business logic from models and controllers into plain Ruby objects:

```ruby
# app/services/orders/create_order.rb
module Orders
  class CreateOrder
    def initialize(user:, cart:)
      @user = user
      @cart = cart
    end

    def call
      ActiveRecord::Base.transaction do
        order = Order.create!(user: @user, total: @cart.total)
        @cart.items.each { |item| order.line_items.create!(item.attributes) }
        order
      end
    end
  end
end
```

## Value Objects

Use `Data.define` (Ruby 3.2+) for immutable values:

```ruby
Money = Data.define(:amount, :currency) do
  def to_s = "#{amount} #{currency}"
end
```

## Query Objects

Encapsulate complex queries:

```ruby
class RecentActiveUsersQuery
  def initialize(relation = User.all)
    @relation = relation
  end

  def call
    @relation.where(active: true).where('last_seen_at > ?', 30.days.ago)
  end
end
```

## Reference

See skill: `ruby-patterns` for comprehensive Ruby idioms.
See skill: `rails-patterns` for Rails-specific architecture patterns.
