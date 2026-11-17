# Automation Exercise Cart Test Plan

## Application Overview

https://www.automationexercise.com cart: adding from lists, the detail page
and recommended items, quantities, removing, the cart after login and the
logged-out checkout prompt. Published test cases 12, 13, 17, 20 and 22 plus
two extras (one known bug). Tests that log in use the `account` fixture
(created by API, deleted in teardown). Ad domains are blocked. Fresh browser
state assumed (the cart is per browser session).

## Test Scenarios

### 3. Cart

**Seed:** `apps/automation-exercise/tests/seed.spec.ts`

#### 3.1. Add Products in Cart

**File:** `apps/automation-exercise/tests/ui/cart-add-products.spec.ts`

**Steps:**
  1. Open /products, click 'Add to cart' on product 1
    - expect: the modal shows "Your product has been added to cart."
  2. Click 'Continue Shopping', click 'Add to cart' on product 2, click 'View Cart'
    - expect: the URL is /view_cart
  3. Read the cart rows
    - expect: Blue Top Rs. 500 x 1 = Rs. 500 and Men Tshirt Rs. 400 x 1 = Rs. 400

#### 3.2. Verify Product quantity in Cart

**File:** `apps/automation-exercise/tests/ui/cart-product-quantity.spec.ts`

**Steps:**
  1. Open the home page and click 'View Product' on product 1
    - expect: "Blue Top" detail is shown
  2. Set quantity to 4, click 'Add to cart', click 'View Cart'
    - expect: the Blue Top row shows quantity 4 and total Rs. 2000

#### 3.3. Remove Products From Cart

**File:** `apps/automation-exercise/tests/ui/cart-remove-product.spec.ts`

**Steps:**
  1. Add products 1 and 2 to the cart and open the cart
    - expect: both rows are shown
  2. Click the X (.cart_quantity_delete) of Blue Top
    - expect: the Blue Top row is gone and Men Tshirt is still there

#### 3.4. Search Products and Verify Cart After Login

**File:** `apps/automation-exercise/tests/ui/cart-search-then-login.spec.ts`

**Steps:**
  1. Open /products and search for "Jeans"
    - expect: "SEARCHED PRODUCTS" shows 3 products
  2. Add every result to the cart and open the cart
    - expect: the 3 jeans are in the cart
  3. Log in with an existing account and open the cart again
    - expect: the same 3 jeans are still in the cart

#### 3.5. Add to cart from Recommended items

**File:** `apps/automation-exercise/tests/ui/cart-recommended-item.spec.ts`

**Steps:**
  1. Open the home page and scroll to the bottom
    - expect: "RECOMMENDED ITEMS" is visible
  2. Click 'Add to cart' on the first visible recommended product, then 'View Cart'
    - expect: that product is in the cart

#### 3.6. Checkout while logged out asks to register or log in

**File:** `apps/automation-exercise/tests/ui/cart-checkout-logged-out.spec.ts`

**Steps:**
  1. Add product 1 to the cart and open the cart
  2. Click 'Proceed To Checkout'
    - expect: the modal shows "Register / Login account to proceed on checkout." and the URL is still /view_cart

#### 3.7. Quantity 0 or below is not added to the cart

**File:** `apps/automation-exercise/tests/ui/cart-negative-quantity-bug.spec.ts`

**Steps:**
  1. Open /product_details/1, set quantity to -1 and click 'Add to cart'
  2. Open the cart
    - expect: no row with a quantity below 1 and no negative total (known bug, seen 2026-11-17: the row shows -1 and Rs. -500)
