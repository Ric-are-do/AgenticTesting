// spec: apps/qapractice-com/specs/flight-booking.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { dateFromToday, traveller } from '@apps/qapractice-com/data/flight';

test.describe('Search', () => {
  test('Same origin and destination is refused', async ({ flightBookingPage }) => {
    // 1. Choose New York for both, one way, a date in 60 days, Search.
    await flightBookingPage.goto();
    await flightBookingPage.search({ from: 'New York', to: 'New York', departure: dateFromToday(60), oneWay: true });
    await expect(flightBookingPage.message('Departure and destination cities cannot be the same.')).toBeVisible();
    await expect(flightBookingPage.departureResults).toHaveCount(0);
  });
});
