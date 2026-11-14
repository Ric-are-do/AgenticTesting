---
app: qapractice-com
area: e-commerce
title: E-commerce shop behaviour
description: Catalogue, search, filters, cart and checkout rules of qapractice.com's shop, with the validation gaps found
updated: 2026-11-13
---

# E-commerce (`/practice-ecommerece-website`)

- 20 products, 8 per page (pages 1-3, the last has 4). Categories: All,
  Electronics, Fashion (3), Beauty, Beverages. Sort: Featured, Price: Low to
  High, Price: High to Low, Avg. Customer Rating.
- Test ids: `ecom-search`, `ecom-category-<name>`, `ecom-sort`,
  `ecom-result-count` ("20 products", "1 product", "3 products in Fashion"),
  `ecom-no-results` ('No products found for "zzzz".'), `product-card-<id>`,
  `view-product-<id>` (name, opens the detail), `quantity-<id>` (min=1),
  `add-to-cart-<id>`, `ecom-page-prev/1/2/3/next`, `ecom-cart-button` (shows
  the item count; empty when the cart is empty).
- Product ids: 1 Laptop Pro $1200, 2 Wireless Mouse $25, 3 Keyboard RGB $80.
- Detail (same route): `ecom-detail-name`, `ecom-detail-price`,
  `ecom-back-to-products`.
- Cart (off-canvas): rows "Wireless Mouse - $25 x 2" with
  `remove-from-cart-<id>`, "Total: $130.00", `ecom-proceed-to-buy` (disabled
  when empty, "Your cart is empty."). Adding the same product again adds 1.
- Checkout: `ecom-address-name/street/city/state/zip`, `ecom-save-address`
  (any empty → alert "Please fill in all address fields."), then
  `ecom-card-number`, `ecom-expiry` (MM/YY), `ecom-cvv`, `ecom-buy-now` (empty →
  "Please enter card number." / "Please enter expiry date." / "Please enter
  CVV."), then `ecom-order-success` "Order Successful!" with the items; the
  cart empties.
- **Bugs:** quantity -1 is added and gives a negative total ($-1200.00); the
  payment step only checks for empty fields (card "1234", expiry "13/30",
  expired, 1-digit CVV all succeed); ZIP "abc" is accepted.
