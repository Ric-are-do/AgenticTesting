/** A well-formed test card (the standard 4111… test number, not a real card). */
export const validCard = { number: '4111111111111111', expiry: '12/30', cvv: '123' };

/** Clearly invalid on every field: too short, month 13, one-digit CVV. */
export const invalidCard = { number: '1234', expiry: '13/99', cvv: '1' };

export const shippingAddress = {
  name: 'Jane Doe',
  street: '1 Main St',
  city: 'Springfield',
  state: 'IL',
  zip: '62704',
};
