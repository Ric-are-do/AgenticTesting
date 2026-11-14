---
app: qapractice-com
area: flight-booking
title: Flight booking behaviour
description: Search rules, result data, steps, totals and validation gaps of qapractice.com's flight booking page
updated: 2026-11-13
---

# Flight booking (`/flight-booking-scenarios`)

- Steps bar (`flight-steps`): Search → Select flights → Passengers → Payment
  → Done, all on one route.
- Search: `flight-from`, `flight-to` (New York, London, Tokyo, Paris, Sydney,
  Mumbai, Delhi, Dubai, Singapore), `flight-departure-date`,
  `flight-return-date` (hidden when `flight-one-way` is ticked),
  `flight-passengers` (default 1), `flight-class` (Economy, Business, First),
  `flight-search`.
- Search errors: "Please select a departure city.", "Please select a
  destination city.", "Please select a departure date.", "Please select a
  return date.", "Departure and destination cities cannot be the same.",
  "Return date must be after departure date.".
- Results New York → London (default = price ascending): AL248 $138 1 stop
  8h 25m, AS174 $149 1 stop 6h 25m, SH137 $185, GW100 $210 4h 15m, BJ211 $232
  4h 20m (non-stop). Returns: AL348, AS274, SH237, GW200 ($210), BJ311.
  `flight-sort` (price asc/desc, duration), `flight-filter-airline`,
  `flight-filter-nonstop`, `flight-result-<code>`, `flight-select-<code>`
  ("Selected ✓" when chosen), `flight-continue-to-passengers` (disabled until
  the departure, and the return for round trips, is chosen).
- Traveller (one form, whatever the passenger count): `flight-passenger-name`,
  `-email`, `-phone`; errors "Please enter the traveller name.", "Please
  enter an email.", "Please enter a phone number.", "Enter a valid email
  address.".
- Payment: `flight-total` = fare(s) × passengers ($210 × 2 = $420; GW100 +
  GW200 = $420), `flight-card-number`, `flight-expiry`, `flight-cvv`,
  `flight-book`; empty → "Please enter the card number." / "…expiry date." /
  "…CVV.".
- Done: `flight-booking-success` "Booking Confirmed!", `flight-pnr` (8
  capitals/digits), both flights listed for a round trip,
  `flight-book-another`.
- **Bugs:** past departure dates and 0 passengers are accepted; phone "abc"
  is accepted; payment accepts any non-empty card, expiry and CVV.
