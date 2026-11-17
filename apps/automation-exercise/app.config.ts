import type { AppConfig } from '@core/app';

/**
 * Automation Exercise, https://www.automationexercise.com. No stored
 * credentials: tests create and delete their own accounts (see fixtures.ts).
 */
export const automationExercise: AppConfig = {
  name: 'automation-exercise',
  baseUrlVar: 'AUTOMATION_EXERCISE_URL',
  defaultBaseUrl: 'https://www.automationexercise.com',
  testIdAttribute: 'data-qa',
  // A shared public demo: more parallel browsers make it reset connections
  // and answer 503 (seen 2026-11-17 with 10 workers).
  workers: 2,
  // Pages take 1-4 s each, AJAX actions (remove from cart) a few seconds more.
  expectTimeout: 15_000,
};
