/** A throwaway account. Every field is what the signup form and the account API take. */
export interface NewUser {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
}

/** A new user with a unique @example.com email (never a real mailbox). */
export function makeUser(): NewUser {
  const id = `${Date.now()}${Math.floor(Math.random() * 1e6)}`;
  return {
    name: `QA ${id.slice(-6)}`,
    email: `qa.${id}@example.com`,
    password: `Pw-${id.slice(-8)}`,
    title: 'Mr',
    birthDay: '10',
    birthMonth: '5',
    birthYear: '1990',
    firstName: 'Test',
    lastName: 'User',
    company: 'QA Co',
    address1: '1 Test Street',
    address2: 'Unit 2',
    country: 'Canada',
    state: 'Ontario',
    city: 'Toronto',
    zipcode: 'M5V 2T6',
    mobile: '4165550100',
  };
}
