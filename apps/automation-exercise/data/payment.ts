export interface Card {
  nameOnCard: string;
  number: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

/** A standard test card number; the site takes no real payment. */
export const validCard: Card = {
  nameOnCard: 'Test User',
  number: '4111111111111111',
  cvc: '123',
  expiryMonth: '12',
  expiryYear: '2030',
};

/** Wrong in every field: letters, month 13, a past year, 1-digit CVC. */
export const invalidCard: Card = {
  nameOnCard: 'x',
  number: 'abcd',
  cvc: '1',
  expiryMonth: '13',
  expiryYear: '1999',
};
