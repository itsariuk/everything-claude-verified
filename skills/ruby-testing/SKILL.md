---
name: ruby-testing
description: Ruby testing patterns using RSpec, factory_bot, mocking with rspec-mocks, SimpleCov coverage, and TDD methodology. Covers unit, integration, and system specs.
origin: ECC
---

# Ruby Testing Patterns

RSpec-first testing patterns for Ruby and Rails applications.

## When to Activate

- Writing RSpec specs for Ruby classes or Rails components
- Setting up factory_bot, SimpleCov, or test helpers
- Debugging failing specs or improving test isolation
- Following TDD: write spec first, then implement

## RSpec Setup

```ruby
# spec/spec_helper.rb
require 'simplecov'
SimpleCov.start 'rails' do
  minimum_coverage 80
  add_filter '/spec/'
  add_filter '/config/'
end

RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end
  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end
end

# spec/rails_helper.rb
require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rspec/rails'
require 'factory_bot_rails'

RSpec.configure do |config|
  config.use_transactional_fixtures = true
  config.include FactoryBot::Syntax::Methods
end
```

## let / let! / subject

```ruby
RSpec.describe Order do
  subject(:order) { build(:order) }

  let(:user)    { create(:user) }
  let!(:item)   { create(:line_item, order: order) }  # eager — creates immediately

  it { is_expected.to be_valid }
  it { expect(order.user).to eq(user) }
end
```

## Factories (factory_bot)

```ruby
# spec/factories/users.rb
FactoryBot.define do
  factory :user do
    name  { Faker::Name.name }
    email { Faker::Internet.unique.email }
    role  { :member }

    trait :admin do
      role { :admin }
    end

    trait :inactive do
      active { false }
    end
  end
end

# Usage
create(:user)
create(:user, :admin)
build(:user, email: "fixed@example.com")
```

## Mocking and Stubbing

```ruby
# Stub a method
allow(user).to receive(:admin?).and_return(true)

# Expect a call
expect(UserMailer).to receive(:welcome).with(user).and_call_original

# Stub class method
allow(Stripe::Charge).to receive(:create).and_return(double(id: "ch_123", status: "succeeded"))

# Partial double — prefer over full double for existing objects
allow(Rails.logger).to receive(:error)
```

## Request Specs (API)

```ruby
RSpec.describe "POST /api/v1/orders", type: :request do
  let(:user)    { create(:user) }
  let(:headers) { { "Authorization" => "Bearer #{user.token}" } }

  context "with valid params" do
    it "creates an order and returns 201" do
      post api_v1_orders_path,
           params: { order: { item_id: create(:item).id } },
           headers: headers

      expect(response).to have_http_status(:created)
      expect(json[:order][:status]).to eq("pending")
    end
  end

  context "with missing params" do
    it "returns 422" do
      post api_v1_orders_path, params: {}, headers: headers
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
```

## Model Specs

```ruby
RSpec.describe User, type: :model do
  subject(:user) { build(:user) }

  describe "validations" do
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_uniqueness_of(:email).case_insensitive }
  end

  describe "associations" do
    it { is_expected.to have_many(:orders).dependent(:destroy) }
  end

  describe "#full_name" do
    it "concatenates first and last name" do
      user = build(:user, first_name: "Jane", last_name: "Doe")
      expect(user.full_name).to eq("Jane Doe")
    end
  end
end
```

## Shared Examples

```ruby
RSpec.shared_examples "a timestamped record" do
  it { is_expected.to respond_to(:created_at, :updated_at) }
end

RSpec.describe Order, type: :model do
  it_behaves_like "a timestamped record"
end
```

## Quick Reference

| Tool | Purpose |
|------|---------|
| `let` / `let!` | Lazy / eager test data |
| `subject` | The object under test |
| `factory_bot` | Test data factories |
| `allow/receive` | Stubs |
| `expect/receive` | Message expectations |
| `SimpleCov` | Coverage reporting |
| `shared_examples` | DRY shared behaviour |
