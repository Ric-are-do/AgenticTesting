// spec: apps/qapractice-com/specs/flight-booking.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Search', () => {
  test('Return date only for round trips', async ({ flightBookingPage }) => {
    // 1. Open the page.
    await flightBookingPage.goto();
    await expect(flightBookingPage.returnDate).toBeVisible();
    await expect(flightBookingPage.oneWay).not.toBeChecked();

    // 2. Tick One Way.
    await flightBookingPage.oneWay.check();
    await expect(flightBookingPage.returnDate).toBeHidden();

    // 3. Untick it.
    await flightBookingPage.oneWay.uncheck();
    await expect(flightBookingPage.returnDate).toBeVisible();
  });
});
