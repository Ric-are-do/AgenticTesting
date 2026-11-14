// spec: apps/qapractice-com/specs/flight-booking.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { dateFromToday, traveller } from '@apps/qapractice-com/data/flight';

test.describe('Results', () => {
  test('Continue waits for the needed flights', async ({ flightBookingPage }) => {
    // 1. Search a round trip New York → London.
    await flightBookingPage.goto();
    await flightBookingPage.search({ from: 'New York', to: 'London', departure: dateFromToday(60), return: dateFromToday(67) });
    await expect(flightBookingPage.continueToPassengersButton).toBeDisabled();

    // 2. Select GW100 only.
    await flightBookingPage.selectFlight('GW100');
    await expect(flightBookingPage.continueToPassengersButton).toBeDisabled();

    // 3. Select return GW200.
    await flightBookingPage.selectFlight('GW200');
    await expect(flightBookingPage.continueToPassengersButton).toBeEnabled();
  });
});
