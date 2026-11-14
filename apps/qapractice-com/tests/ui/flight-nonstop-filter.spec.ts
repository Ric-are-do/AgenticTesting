// spec: apps/qapractice-com/specs/flight-booking.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { dateFromToday, traveller } from '@apps/qapractice-com/data/flight';

test.describe('Results', () => {
  test('Non-stop filter keeps only non-stop flights', async ({ flightBookingPage }) => {
    // 1. Search, tick Non-stop only.
    await flightBookingPage.goto();
    await flightBookingPage.search({ from: 'New York', to: 'London', departure: dateFromToday(60), oneWay: true });
    await flightBookingPage.nonStopFilter.check();
    await expect(flightBookingPage.departureResults).toHaveCount(3);
    for (const code of ['SH137', 'GW100', 'BJ211']) await expect(flightBookingPage.result(code)).toContainText('Non-stop');
  });
});
