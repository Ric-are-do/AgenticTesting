// spec: apps/qapractice-com/specs/flight-booking.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Search', () => {
  test('Past departure date is refused (known bug)', async ({ flightBookingPage }) => {
    // Known bug (seen 2026-11-13): a departure date of 2020-01-01 is accepted and shows 5 flights.
    // The test states the correct behaviour and is expected to fail until the
    // site is fixed; then Playwright reports it as an unexpected pass.
    test.fail(true, 'Known bug: a departure date of 2020-01-01 is accepted and shows 5 flights.');
    // 1. New York → London, one way, departure 2020-01-01, Search.
    await flightBookingPage.goto();
    await flightBookingPage.search({ from: 'New York', to: 'London', departure: '2020-01-01', oneWay: true });
    await expect(flightBookingPage.departureResults).toHaveCount(0);
  });
});
