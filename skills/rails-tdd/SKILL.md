---
name: rails-tdd
description: Test-driven development for Rails using RSpec, factory_bot, DatabaseCleaner, Capybara system specs, and request specs. Red-green-refactor with 80% coverage enforced by SimpleCov.
origin: ECC
---

# Rails TDD

Test-driven development workflow for Rails applications.

## When to Activate

- Adding a new Rails feature, endpoint, or model
- Fixing a bug (write a failing spec first)
- Reviewing test coverage for a Rails app

## Workflow: Red → Green → Refactor

1. **RED** — Write a failing spec
2. **GREEN** — Write minimal code to pass it
3. **REFACTOR** — Clean up, run suite to confirm green
4. **GATE** — `bundle exec rspec` + coverage ≥ 80%

## Rails Test Types

| Type | Location | When |
|------|----------|------|
| Model spec | `spec/models/` | Validations, associations, methods |
| Request spec | `spec/requests/` | HTTP endpoints, authentication |
| Service spec | `spec/services/` | Business logic |
| Job spec | `spec/jobs/` | Background job behaviour |
| System spec | `spec/system/` | Critical user flows (Capybara) |

## Model TDD Example

```ruby
# spec/models/order_spec.rb — RED
RSpec.describe Order, type: :model do
  describe "validations" do
    it { is_expected.to validate_presence_of(:status) }
    it { is_expected.to belong_to(:user) }
  end

  describe "#total" do
    it "sums line item amounts" do
      order = build(:order)
      order.line_items << build(:line_item, amount: 10)
      order.line_items << build(:line_item, amount: 25)
      expect(order.total).to eq(35)
    end
  end
end

# app/models/order.rb — GREEN
class Order < ApplicationRecord
  belongs_to :user
  has_many :line_items, dependent: :destroy

  validates :status, presence: true

  def total = line_items.sum(&:amount)
end
```

## Request Spec TDD Example

```ruby
# spec/requests/api/v1/orders_spec.rb — RED
RSpec.describe "POST /api/v1/orders", type: :request do
  let(:user) { create(:user) }

  before { sign_in user }

  context "with valid params" do
    it "creates an order" do
      expect {
        post api_v1_orders_path, params: { order: { item_id: create(:item).id } }
      }.to change(Order, :count).by(1)

      expect(response).to have_http_status(:created)
    end
  end

  context "when unauthenticated" do
    before { sign_out }

    it "returns 401" do
      post api_v1_orders_path
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
```

## System Spec (Capybara)

```ruby
# spec/system/checkout_spec.rb
RSpec.describe "Checkout", type: :system do
  before { driven_by :selenium, using: :headless_chrome }

  it "completes a purchase" do
    user = create(:user)
    item = create(:item, price: 20)

    sign_in user
    visit item_path(item)
    click_on "Add to cart"
    click_on "Checkout"
    fill_in "Card number", with: "4242424242424242"
    click_on "Pay"

    expect(page).to have_text("Order confirmed")
    expect(Order.last.user).to eq(user)
  end
end
```

## Test Helpers

```ruby
# spec/support/authentication_helper.rb
module AuthenticationHelper
  def sign_in(user)
    post sign_in_path, params: { email: user.email, password: user.password }
  end
end

RSpec.configure do |config|
  config.include AuthenticationHelper, type: :request
end
```

## DatabaseCleaner Setup

```ruby
# spec/support/database_cleaner.rb
RSpec.configure do |config|
  config.before(:suite)    { DatabaseCleaner.strategy = :transaction }
  config.before(:each)     { DatabaseCleaner.start }
  config.after(:each)      { DatabaseCleaner.clean }
  config.before(:each, type: :system) do
    DatabaseCleaner.strategy = :truncation
  end
end
```

## Coverage Gate

```ruby
# spec/spec_helper.rb
SimpleCov.start 'rails' do
  minimum_coverage 80
  refuse_coverage_drop
end
```

Run the gate:

```bash
bundle exec rspec && open coverage/index.html
```
