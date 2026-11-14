// spec: apps/qapractice-com/specs/flight-booking.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Search', () => {
  test('Empty search lists every missing field', async ({ flightBookingPage }) => {
    // 1. Click Search Flights with nothing filled.
    await flightBookingPage.goto();
    await flightBookingPage.search({});
    for (const text of [
      'Please select a departure city.',
      'Please select a destination city.',
      'Please select a departure date.',
      'Please select a return date.',
    ]) await expect(flightBookingPage.message(text)).toBeVisible();
  });
});
