# QA Practice Flight Booking Test Plan

## Application Overview

https://www.qapractice.com/flight-booking-scenarios: search (from, to,
departure and return dates, passengers, class, One Way) → results (sort,
airline filter, non-stop filter, select) → traveller details → payment →
"Booking Confirmed!" with a booking reference. All in one page and
browser-only. Cities: New York, London, Tokyo, Paris, Sydney, Mumbai, Delhi,
Dubai, Singapore. New York → London gives AL248 $138 (1 stop), AS174 $149
(1 stop), SH137 $185, GW100 $210, BJ211 $232 (non-stop); return GW200 $210.
Dates are relative to today (`dateFromToday`). Fresh browser state assumed.
Seen live 2026-11-13.

## Test Scenarios

### 1. Search

**Seed:** `apps/qapractice-com/tests/seed.spec.ts`

#### 1.1. Return date only for round trips

**File:** `apps/qapractice-com/tests/ui/flight-return-date-toggle.spec.ts`

**Steps:**
  1. Open the page.
    - expect: [data-testid=flight-return-date] visible; One Way unticked
  2. Tick [data-testid=flight-one-way].
    - expect: return date hidden
  3. Untick it.
    - expect: return date visible again

#### 1.2. Empty search lists every missing field

**File:** `apps/qapractice-com/tests/ui/flight-search-empty.spec.ts`

**Steps:**
  1. Click [data-testid=flight-search] with nothing filled.
    - expect: "Please select a departure city.", "Please select a destination city.", "Please select a departure date.", "Please select a return date."

#### 1.3. Same origin and destination is refused

**File:** `apps/qapractice-com/tests/ui/flight-same-city.spec.ts`

**Steps:**
  1. Choose New York for both, one way, a date in 60 days, Search.
    - expect: "Departure and destination cities cannot be the same."; no results

#### 1.4. Return before departure is refused

**File:** `apps/qapractice-com/tests/ui/flight-return-before-departure.spec.ts`

**Steps:**
  1. New York → London, departure in 67 days, return in 60 days, Search.
    - expect: "Return date must be after departure date."; no results

#### 1.5. Past departure date is refused (known bug)

**File:** `apps/qapractice-com/tests/ui/flight-past-date-bug.spec.ts`

**Steps:**
  1. New York → London, one way, departure 2020-01-01, Search.
    - expect: an error and no results. **Live (2026-11-13): 5 results are shown.** Marked `test.fail()` until fixed.

### 2. Results

**Seed:** `apps/qapractice-com/tests/seed.spec.ts`

#### 2.1. Sort by price high to low and by duration

**File:** `apps/qapractice-com/tests/ui/flight-sort.spec.ts`

**Steps:**
  1. Search New York → London one way, choose "Price: High to Low" in [data-testid=flight-sort].
    - expect: order BJ211, GW100, SH137, AS174, AL248
  2. Choose "Duration: Shortest".
    - expect: order GW100, BJ211, SH137, AS174, AL248

#### 2.2. Non-stop filter keeps only non-stop flights

**File:** `apps/qapractice-com/tests/ui/flight-nonstop-filter.spec.ts`

**Steps:**
  1. Search, tick [data-testid=flight-filter-nonstop].
    - expect: three results, each "Non-stop" (SH137, GW100, BJ211)

#### 2.3. Airline filter keeps one airline

**File:** `apps/qapractice-com/tests/ui/flight-airline-filter.spec.ts`

**Steps:**
  1. Search, choose BlueJet in [data-testid=flight-filter-airline].
    - expect: one result, BJ211

#### 2.4. Continue waits for the needed flights

**File:** `apps/qapractice-com/tests/ui/flight-continue-needs-selection.spec.ts`

**Steps:**
  1. Search a round trip New York → London.
    - expect: [data-testid=flight-continue-to-passengers] disabled
  2. Select GW100 only.
    - expect: still disabled
  3. Select return GW200.
    - expect: enabled

### 3. Booking

**Seed:** `apps/qapractice-com/tests/seed.spec.ts`

#### 3.1. One-way booking is confirmed

**File:** `apps/qapractice-com/tests/ui/flight-one-way-booking.spec.ts`

**Steps:**
  1. Search one way, select GW100, continue, enter the traveller, continue.
    - expect: [data-testid=flight-total] "$210"
  2. Pay with the valid card.
    - expect: [data-testid=flight-booking-success] "Booking Confirmed!"; [data-testid=flight-pnr] is 8 capital letters or digits

#### 3.2. Round trip books both flights

**File:** `apps/qapractice-com/tests/ui/flight-round-trip-booking.spec.ts`

**Steps:**
  1. Search a round trip, select GW100 and GW200, continue, enter the traveller, continue.
    - expect: total "$420"
  2. Pay.
    - expect: "Booking Confirmed!"; the confirmation names "Global Wings (GW100)" and "Global Wings (GW200)"

#### 3.3. Total is per passenger

**File:** `apps/qapractice-com/tests/ui/flight-two-passengers-total.spec.ts`

**Steps:**
  1. Search one way with 2 passengers, select GW100, continue, enter the traveller, continue.
    - expect: total "$420"

#### 3.4. Traveller details are required and checked

**File:** `apps/qapractice-com/tests/ui/flight-traveller-validation.spec.ts`

**Steps:**
  1. Reach the traveller step and click Continue to payment with everything empty.
    - expect: "Please enter the traveller name.", "Please enter an email.", "Please enter a phone number."
  2. Fill the traveller but email "jane@example", continue.
    - expect: "Enter a valid email address."; the card fields are not shown

#### 3.5. Empty payment details are refused

**File:** `apps/qapractice-com/tests/ui/flight-payment-required.spec.ts`

**Steps:**
  1. Reach payment and click Pay & Confirm Booking with the card fields empty.
    - expect: "Please enter the card number.", "Please enter the expiry date.", "Please enter the CVV."

#### 3.6. Invalid card is refused (known bug)

**File:** `apps/qapractice-com/tests/ui/flight-invalid-card-bug.spec.ts`

**Steps:**
  1. Reach payment, enter card 1234, expiry 13/99, CVV 1, pay.
    - expect: validation errors and no booking. **Live (2026-11-13): "Booking Confirmed!".** Marked `test.fail()` until fixed.
