import type { AppConfig } from '@framework/app-config';

/** No login on this site, so no users. A URL is not a secret: it has a default. */
export const qaPractice: AppConfig = {
  name: 'qa-practice',
  baseUrlVar: 'QA_PRACTICE_URL',
  defaultBaseUrl: 'https://qaengineerwaqas.com',
};
