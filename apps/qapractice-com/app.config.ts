import type { AppConfig } from '@core/app';

/** QA Practice, https://www.qapractice.com (not the same site as qa-practice). */
export const qapracticeCom: AppConfig = {
  name: 'qapractice-com',
  baseUrlVar: 'QAPRACTICE_COM_URL',
  defaultBaseUrl: 'https://www.qapractice.com',
};

/**
 * Fictional demo values the site prints on its own pages. The user approved
 * them as code defaults on 2026-11-13 (see the app's memory); env vars override.
 */
export const demoAccount = {
  email: process.env.QAPRACTICE_COM_EMAIL || 'user@premiumbank.com',
  password: process.env.QAPRACTICE_COM_PASSWORD || 'Bank@123',
  secretCode: process.env.QAPRACTICE_COM_SECRET_CODE || 'BANK1234',
};
