// spec: apps/qapractice-com/specs/flight-booking.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { dateFromToday, traveller } from '@apps/qapractice-com/data/flight';

test.describe('Search', () => {
  test('Return before departure is refused', async ({ flightBookingPage }) => {
    // 1. New York → London, departure in 67 days, return in 60 days, Search.
    await flightBookingPage.goto();
    await flightBookingPage.search({ from: 'New York', to: 'London', departure: dateFromToday(67), return: dateFromToday(60) });
    await expect(flightBookingPage.message('Return date must be after departure date.')).toBeVisible();
    await expect(flightBookingPage.departureResults).toHaveCount(0);
  });
});
