# QA Practice E-commerce Test Plan

## Application Overview

https://www.qapractice.com/practice-ecommerece-website (route misspelled on
the site): 20 products, 8 per page over 3 pages, search, 5 category buttons,
sort, product detail, off-canvas cart, address and payment steps, order
confirmation. Browser-only; nothing is sent or saved, so orders are safe.
Product ids: 1 Laptop Pro $1200, 2 Wireless Mouse $25, 3 Keyboard RGB $80.
Address and cards: `apps/qapractice-com/data/payment.ts`. Fresh browser
state assumed. Seen live 2026-11-13.

## Test Scenarios

### 1. Browsing

**Seed:** `apps/qapractice-com/tests/seed.spec.ts`

#### 1.1. Search narrows the products

**File:** `apps/qapractice-com/tests/ui/shop-search.spec.ts`

**Steps:**
  1. Type "mouse" in [data-testid=ecom-search].
    - expect: one product, "Wireless Mouse"; [data-testid=ecom-result-count] reads "1 product"

#### 1.2. Search with no match shows an empty state

**File:** `apps/qapractice-com/tests/ui/shop-search-no-results.spec.ts`

**Steps:**
  1. Type "zzzz" in the search.
    - expect: [data-testid=ecom-no-results] reads 'No products found for "zzzz".'; count reads "0 products"

#### 1.3. Category filter shows only that category

**File:** `apps/qapractice-com/tests/ui/shop-category-filter.spec.ts`

**Steps:**
  1. Click [data-testid=ecom-category-fashion].
    - expect: "Gold Zipper Bag", "Premium Ladies Purse", "Ladies Shoes"; count reads "3 products in Fashion"

#### 1.4. Sort by price low to high

**File:** `apps/qapractice-com/tests/ui/shop-sort-price.spec.ts`

**Steps:**
  1. Choose "Price: Low to High" in [data-testid=ecom-sort].
    - expect: the first three products are "Coca Cola 250ml", "Mango Drink", "Rosemary Oil"

#### 1.5. Pagination moves through three pages

**File:** `apps/qapractice-com/tests/ui/shop-pagination.spec.ts`

**Steps:**
  1. Open the shop.
    - expect: 8 products; Previous is disabled
  2. Click [data-testid=ecom-page-2].
    - expect: first product "Beauty Product"; Previous is enabled
  3. Click [data-testid=ecom-page-3].
    - expect: 4 products; Next is disabled

#### 1.6. Product detail shows name and price

**File:** `apps/qapractice-com/tests/ui/shop-product-detail.spec.ts`

**Steps:**
  1. Click [data-testid=view-product-1].
    - expect: [data-testid=ecom-detail-name] "Laptop Pro", [data-testid=ecom-detail-price] "$1200"
  2. Click [data-testid=ecom-back-to-products].
    - expect: the product list is back

### 2. Cart and checkout

**Seed:** `apps/qapractice-com/tests/seed.spec.ts`

#### 2.1. Empty cart cannot be bought

**File:** `apps/qapractice-com/tests/ui/shop-empty-cart.spec.ts`

**Steps:**
  1. Click [data-testid=ecom-cart-button] with nothing added.
    - expect: "Your cart is empty."; "Total: $0.00"; [data-testid=ecom-proceed-to-buy] is disabled

#### 2.2. Added products and quantities show in the cart

**File:** `apps/qapractice-com/tests/ui/shop-add-to-cart.spec.ts`

**Steps:**
  1. Set [data-testid=quantity-2] to 2 and click [data-testid=add-to-cart-2]; click [data-testid=add-to-cart-3].
    - expect: the cart button shows 3
  2. Open the cart.
    - expect: rows "Wireless Mouse - $25 x 2" and "Keyboard RGB - $80 x 1"; "Total: $130.00"

#### 2.3. Removing an item updates the total

**File:** `apps/qapractice-com/tests/ui/shop-remove-from-cart.spec.ts`

**Steps:**
  1. Add 2 × Wireless Mouse and 1 × Keyboard RGB, open the cart, click [data-testid=remove-from-cart-3].
    - expect: one row left; "Total: $50.00"; the cart button shows 2

#### 2.4. Full checkout places the order

**File:** `apps/qapractice-com/tests/ui/shop-checkout.spec.ts`

**Steps:**
  1. Add Wireless Mouse, open the cart, click Proceed to Buy.
    - expect: the address fields are shown
  2. Fill the shipping address, click [data-testid=ecom-save-address].
    - expect: the card fields are shown
  3. Fill the valid card, click [data-testid=ecom-buy-now].
    - expect: [data-testid=ecom-order-success] "Order Successful!"; the line "Wireless Mouse - $25 x 1"; the cart button is empty

#### 2.5. Empty address is refused

**File:** `apps/qapractice-com/tests/ui/shop-address-required.spec.ts`

**Steps:**
  1. Add a product, Proceed to Buy, click Save Address with every field empty.
    - expect: an alert "Please fill in all address fields."; the card fields are not shown

#### 2.6. Empty payment details are refused

**File:** `apps/qapractice-com/tests/ui/shop-payment-required.spec.ts`

**Steps:**
  1. Reach the payment step and click Buy Now with the card fields empty.
    - expect: "Please enter card number.", "Please enter expiry date.", "Please enter CVV."; no order success

#### 2.7. Negative quantity is refused (known bug)

**File:** `apps/qapractice-com/tests/ui/shop-negative-quantity-bug.spec.ts`

**Steps:**
  1. Set [data-testid=quantity-1] to -1, Add to Cart, open the cart.
    - expect: the cart stays empty (the input has min=1). **Live (2026-11-13): "Laptop Pro - $1200 x -1" and "Total: $-1200.00".** Marked `test.fail()` until fixed.

#### 2.8. Invalid card is refused (known bug)

**File:** `apps/qapractice-com/tests/ui/shop-invalid-card-bug.spec.ts`

**Steps:**
  1. Reach the payment step, enter card 1234, expiry 13/99, CVV 1, click Buy Now.
    - expect: validation errors and no order. **Live (2026-11-13): "Order Successful!".** Marked `test.fail()` until fixed.
