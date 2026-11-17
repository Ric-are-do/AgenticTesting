# Automation Exercise Products Test Plan

## Application Overview

https://www.automationexercise.com product browsing: all products, product
detail, search, categories, brands and reviews. Published test cases 8, 9,
18, 19 and 21 plus one extra. No login. Ad domains are blocked. Fresh
browser state assumed.

## Test Scenarios

### 2. Products

**Seed:** `apps/automation-exercise/tests/seed.spec.ts`

#### 2.1. Verify All Products and product detail page

**File:** `apps/automation-exercise/tests/ui/products-all-and-detail.spec.ts`

**Steps:**
  1. Open the home page and click 'Products'
    - expect: "ALL PRODUCTS" is visible and the list shows 34 products
  2. Click 'View Product' of the first product
    - expect: the URL is /product_details/1
  3. Read the product information
    - expect: "Blue Top", "Category: Women > Tops", "Rs. 500", "Availability: In Stock", "Condition: New", "Brand: Polo" are visible

#### 2.2. Search Product

**File:** `apps/automation-exercise/tests/ui/products-search.spec.ts`

**Steps:**
  1. Open /products
    - expect: "ALL PRODUCTS" is visible
  2. Type "Dress" in #search_product and click #submit_search
    - expect: "SEARCHED PRODUCTS" is visible
  3. Read the result names
    - expect: 9 products, including "Sleeveless Dress" and "Stylish Dress"

#### 2.3. Search with no matches shows no products

**File:** `apps/automation-exercise/tests/ui/products-search-no-results.spec.ts`

**Steps:**
  1. Open /products, search for "zzzzqq"
    - expect: "SEARCHED PRODUCTS" is visible and no product cards are shown

#### 2.4. View Category Products

**File:** `apps/automation-exercise/tests/ui/products-category.spec.ts`

**Steps:**
  1. Open the home page
    - expect: the CATEGORY sidebar shows Women, Men, Kids
  2. Click 'Women', then 'Tops'
    - expect: the URL is /category_products/2 and "WOMEN - TOPS PRODUCTS" is visible
  3. Click 'Men', then 'Tshirts'
    - expect: the URL is /category_products/3 and "MEN - TSHIRTS PRODUCTS" is visible

#### 2.5. View & Cart Brand Products

**File:** `apps/automation-exercise/tests/ui/products-brand.spec.ts`

**Steps:**
  1. Open /products
    - expect: the BRANDS sidebar is visible
  2. Click 'Polo'
    - expect: "BRAND - POLO PRODUCTS" is visible with 6 products
  3. Click 'H&M'
    - expect: "BRAND - H&M PRODUCTS" is visible with 5 products

#### 2.6. Add review on product

**File:** `apps/automation-exercise/tests/ui/products-review.spec.ts`

**Steps:**
  1. Open /products and click 'View Product' of the first product
    - expect: "WRITE YOUR REVIEW" is visible
  2. Enter name, email and review text, click #button-review
    - expect: "Thank you for your review." is visible
