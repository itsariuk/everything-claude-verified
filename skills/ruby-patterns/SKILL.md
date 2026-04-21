---
name: ruby-patterns
description: Idiomatic Ruby patterns, best practices, and conventions for building robust, maintainable Ruby applications. Covers enumerable, blocks, error handling, value objects, metaprogramming discipline, and Ruby 3.x features.
origin: ECC
---

# Ruby Patterns

Idiomatic Ruby patterns for clean, maintainable code.

## When to Activate

- Writing Ruby classes, modules, or gems
- Reviewing Ruby code for idiom and style
- Designing service objects, value objects, or query objects
- Working with Ruby 3.x features (Data, pattern matching, endless methods)

## Core Idioms

### Enumerable First

```ruby
# Prefer enumerable over loops
users.select(&:active?).map(&:email).sort

# Use lazy enumerator for large collections
(1..Float::INFINITY).lazy.select(&:odd?).first(10)
```

### Blocks and Procs

```ruby
# Block as configuration
class Report
  def initialize(&block)
    @config = block
  end
  def run = @config.call(self)
end

# Symbol#to_proc shorthand
names = users.map(&:name)   # equivalent to users.map { |u| u.name }
```

### Keyword Arguments (Ruby 2.1+)

```ruby
def create_user(name:, email:, role: :member)
  User.new(name: name, email: email, role: role)
end
```

### Pattern Matching (Ruby 3.0+)

```ruby
case response
in { status: 200, body: { user: { name: String => name } } }
  puts "Welcome, #{name}"
in { status: 404 }
  raise NotFoundError
end
```

### Value Objects with Data (Ruby 3.2+)

```ruby
Money = Data.define(:amount, :currency) do
  def +(other)
    raise ArgumentError, "Currency mismatch" unless currency == other.currency
    with(amount: amount + other.amount)
  end

  def to_s = "#{amount} #{currency}"
end

price = Money.new(amount: 100, currency: "USD")
```

## Error Handling

```ruby
# Define custom exception hierarchy
module MyApp
  Error = Class.new(StandardError)
  NotFoundError = Class.new(Error)
  ValidationError = Class.new(Error) do
    attr_reader :errors
    def initialize(errors) = super("Validation failed: #{errors.join(', ')}").tap { @errors = errors }
  end
end

# Rescue specific errors; never rescue Exception
def fetch_user(id)
  User.find(id)
rescue ActiveRecord::RecordNotFound
  raise MyApp::NotFoundError, "User #{id} not found"
end
```

## Service Objects

```ruby
# app/services/users/register.rb
module Users
  class Register
    def initialize(params)
      @params = params
    end

    def call
      user = User.new(@params)
      user.save!
      UserMailer.welcome(user).deliver_later
      user
    end
  end
end

# Usage
Users::Register.new(user_params).call
```

## Query Objects

```ruby
class ActiveUsersQuery
  def initialize(relation = User.all)
    @relation = relation
  end

  def call(since: 30.days.ago)
    @relation.where(active: true).where("last_seen_at > ?", since)
  end
end
```

## Modules and Mixins

```ruby
# Prefer composition over deep inheritance
module Timestampable
  def self.included(base)
    base.before_create { self.created_at = Time.current }
    base.before_save   { self.updated_at = Time.current }
  end
end

class Article
  include Timestampable
end
```

## Metaprogramming — Use Sparingly

```ruby
# Acceptable: DSL in a base class
class Validator
  def self.validates(attr, &block)
    define_method("validate_#{attr}") { block.call(send(attr)) }
  end
end

# Avoid: define_method in hot paths, method_missing without respond_to_missing?
```

## Quick Reference

| Pattern | Use When |
|---------|----------|
| Enumerable | Transforming / filtering collections |
| Data.define | Immutable value objects (Ruby 3.2+) |
| Service object | Business logic outside models |
| Query object | Complex, reusable DB queries |
| Pattern matching | Destructuring nested structures |
| Custom exceptions | Expressing domain error categories |
