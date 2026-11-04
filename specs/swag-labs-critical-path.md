# Swag Labs Critical Path Test Plan

## Application Overview

Focused plan for https://www.saucedemo.com/ covering the end-to-end purchase flow (login -> inventory -> cart -> checkout -> finish -> home) plus two brief supporting negative scenarios. Fresh browser state assumed. Credentials: standard_user / secret_sauce.

## Test Scenarios

### 1. Swag Labs Critical Path

**Seed:** `tests/swag Lab tests/seed.spec.ts`

#### 1.1. Complete purchase of two items as standard_user

**File:** `tests/swag Lab tests/checkout-happy-path.spec.ts`

**Steps:**
  1. Go to https://www.saucedemo.com/. Fill [data-test=username] with standard_user, [data-test=password] with secret_sauce, click [data-test=login-button].
    - expect: URL is /inventory.html
    - expect: 6 [data-test=inventory-item] are listed
  2. Click [data-test=add-to-cart-sauce-labs-backpack] ($29.99) and [data-test=add-to-cart-sauce-labs-bike-light] ($9.99).
    - expect: [data-test=shopping-cart-badge] shows 2
    - expect: Buttons switch to remove-sauce-labs-backpack / remove-sauce-labs-bike-light
  3. Click [data-test=shopping-cart-link].
    - expect: URL is /cart.html
    - expect: [data-test=inventory-item-name] shows Sauce Labs Backpack and Sauce Labs Bike Light
  4. Click [data-test=checkout].
    - expect: URL is /checkout-step-one.html
  5. Fill [data-test=firstName]=John, [data-test=lastName]=Doe, [data-test=postalCode]=12345; click [data-test=continue].
    - expect: URL is /checkout-step-two.html
  6. Verify the overview.
    - expect: Both items listed
    - expect: [data-test=subtotal-label] = 'Item total: $39.98'
    - expect: [data-test=tax-label] = 'Tax: $3.20'
    - expect: [data-test=total-label] = 'Total: $43.18'
    - expect: [data-test=payment-info-value] = 'SauceCard #31337'
    - expect: [data-test=shipping-info-value] = 'Free Pony Express Delivery!'
  7. Click [data-test=finish].
    - expect: URL is /checkout-complete.html
    - expect: [data-test=complete-header] = 'Thank you for your order!'
    - expect: [data-test=complete-text] = 'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
  8. Click [data-test=back-to-products].
    - expect: URL is /inventory.html
    - expect: Cart badge no longer shown

#### 1.2. Locked out user cannot log in

**File:** `tests/swag Lab tests/login-locked-out.spec.ts`

**Steps:**
  1. Go to https://www.saucedemo.com/, login with locked_out_user / secret_sauce.
    - expect: [data-test=error] = 'Epic sadface: Sorry, this user has been locked out.'
    - expect: URL remains https://www.saucedemo.com/

#### 1.3. Checkout step one rejects empty form

**File:** `tests/swag Lab tests/checkout-empty-form.spec.ts`

**Steps:**
  1. Login as standard_user, add Sauce Labs Backpack, open cart, click [data-test=checkout], then click [data-test=continue] with all fields empty.
    - expect: [data-test=error] = 'Error: First Name is required'
    - expect: URL remains /checkout-step-one.html
