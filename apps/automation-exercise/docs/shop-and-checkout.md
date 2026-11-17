---
app: automation-exercise
area: shop-and-checkout
title: Shop, cart, checkout and account behaviour
description: Exact texts, routes and locators for automationexercise.com's products, cart, signup, login, checkout, payment and contact flows
updated: 2026-11-17
---

# Shop, cart, checkout and accounts

## Products
- `/products`: "ALL PRODUCTS", 34 cards (`.features_items .product-image-wrapper`);
  first two: 1 Blue Top Rs. 500, 2 Men Tshirt Rs. 400; 3 Sleeveless Dress Rs. 1000.
- Search: `#search_product`, `#submit_search` → "SEARCHED PRODUCTS"; "dress"
  gives 9 products, "zzzz" gives none.
- Detail `/product_details/1`: "Blue Top", "Category: Women > Tops", "Rs.
  500", "Availability: In Stock", "Condition: New", "Brand: Polo";
  `#quantity` (default 1), "Add to cart" button; review form `#name`,
  `#email`, `#review`, `#button-review` → "Thank you for your review.".
- Categories (sidebar `#accordian`): Women (Dress 1, Tops 2, Saree 7), Men
  (Tshirts 3, Jeans 6), Kids (Dress 4, Tops & Shirts 5). Headings "WOMEN -
  DRESS PRODUCTS", "WOMEN - TOPS PRODUCTS", "MEN - TSHIRTS PRODUCTS".
- Brands (`.brands-name`): Polo (6), H&M (5), Madame (5), Mast & Harbour (3),
  Babyhug (4), Allen Solly Junior (3), Kookie Kids (3), Biba (5); headings
  "BRAND - POLO PRODUCTS".
- Home: "RECOMMENDED ITEMS" carousel (`.recommended_items`); the active slide
  shows products 4, 5, 6.

## Cart
- Add → modal `#cartModal` "Added!" / "Your product has been added to cart."
  with View Cart link and Continue Shopping button.
- `/view_cart`: `#cart_info_table` rows `#product-<id>`: `.cart_description`
  (name, "Women > Tops"), `.cart_price` "Rs. 500", `.cart_quantity` "1",
  `.cart_total` "Rs. 500", `.cart_quantity_delete` (X). Empty: `#empty_cart`
  "Cart is empty! Click here to buy products.".
- Proceed To Checkout logged out → `#checkoutModal` "Register / Login account
  to proceed on checkout." with a Register / Login link.

## Accounts
- `/login`: `login-email`, `login-password`, `login-button`; "New User
  Signup!" with `signup-name`, `signup-email`, `signup-button`.
- `/signup` "ENTER ACCOUNT INFORMATION": `#id_gender1/2`, `password`, `days`,
  `months`, `years`, `#newsletter`, `#optin`, `first_name`, `last_name`,
  `company`, `address`, `address2`, `country` (7 options: India, United
  States, Canada, Australia, ...), `state`, `city`, `zipcode`,
  `mobile_number`, `create-account`.
- `account-created` "ACCOUNT CREATED!", `continue-button` → home with "Logged
  in as <name>", Logout, Delete Account.
- Errors: "Your email or password is incorrect!", "Email Address already
  exist!". Logout → `/login`. Delete Account → `account-deleted` "ACCOUNT
  DELETED!", Continue → home.

## Checkout and payment
- `/checkout`: `#address_delivery` / `#address_invoice` "YOUR DELIVERY
  ADDRESS" / "YOUR BILLING ADDRESS": "Mr. First Last", company, address1,
  address2, "City State Zip", country, phone. Review table with "Total
  Amount" (Rs. 900 for products 1 + 2); comment `textarea[name=message]`;
  "Place Order" link.
- `/payment`: `name-on-card`, `card-number`, `cvc`, `expiry-month`,
  `expiry-year`, `pay-button` (empty fields: browser "Please fill out this
  field.").
- `/payment_done/<total>`: `order-placed` "ORDER PLACED!", "Congratulations!
  Your order has been confirmed!", Download Invoice, `continue-button`.

## Contact and footer
- `/contact_us` "GET IN TOUCH": `name`, `email` (required), `subject`,
  `message`, `input[name=upload_file]`, `submit-button` → confirm dialog →
  "Success! Your details have been submitted successfully." and a Home link.
- Footer: "SUBSCRIPTION", `#susbscribe_email`, `#subscribe` →
  `#success-subscribe` "You have been successfully subscribed!".
- `#scrollUp` arrow appears after scrolling; it scrolls back to the slider
  "Full-Fledged practice website for Automation Engineers".
