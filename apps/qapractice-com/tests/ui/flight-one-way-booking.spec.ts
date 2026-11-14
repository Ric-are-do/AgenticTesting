// spec: apps/qapractice-com/specs/flight-booking.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { dateFromToday, traveller } from '@apps/qapractice-com/data/flight';
import { invalidCard, validCard } from '@apps/qapractice-com/data/payment';

test.describe('Booking', () => {
  test('One-way booking is confirmed', async ({ flightBookingPage }) => {
    // 1. Search one way, select GW100, continue, enter the traveller, continue.
    await flightBookingPage.goto();
    await flightBookingPage.search({ from: 'New York', to: 'London', departure: dateFromToday(60), oneWay: true });
    await flightBookingPage.selectFlight('GW100');
    await flightBookingPage.continueToPassengers();
    await flightBookingPage.enterTraveller(traveller);
    await expect(flightBookingPage.total).toHaveText('$210');

    // 2. Pay with the valid card.
    await flightBookingPage.pay(validCard);
    await expect(flightBookingPage.bookingConfirmed).toHaveText('Booking Confirmed!');
    await expect(flightBookingPage.bookingReference).toHaveText(/^[A-Z0-9]{8}$/);
  });
});
