/** One person's details for the web forms page (/practice-forms). */
export interface FormDetails {
  country: string;
  title: string;
  firstName: string;
  lastName: string;
  /** YYYY-MM-DD */
  dateOfBirth: string;
  /** dd/mm/yyyy */
  dateOfJoining: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  /** null = leave both radios unselected */
  communication: 'email' | 'phone' | null;
}

/** Accepted by the form (seen live 2026-11-13). Override one field per negative test. */
export const validFormDetails: FormDetails = {
  country: 'India',
  title: 'Ms.',
  firstName: 'Jane',
  lastName: 'Doe',
  dateOfBirth: '1990-05-15',
  dateOfJoining: '01/06/2021',
  email: 'jane.doe@example.com',
  phoneCode: '+91',
  phoneNumber: '9876543210',
  communication: 'email',
};
