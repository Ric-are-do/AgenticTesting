import dotenv from 'dotenv';
import { devices } from '@playwright/test';
import type { Project } from '@playwright/test';

/** One app under test. Lives in apps/<name>/app.config.ts and is listed in apps/index.ts. */
export interface AppConfig {
  /** kebab-case; also the folder name under apps/ and the Playwright project name. */
  name: string;
  /** Env var that overrides the base URL. */
  baseUrlVar: string;
  /** A URL is not a secret: fine to default. */
  defaultBaseUrl?: string;
  /** Only if the app uses something other than data-testid. */
  testIdAttribute?: string;
}

/** Loads .env if present; a missing file is fine (CI has none). */
export function loadDotEnv(): void {
  dotenv.config({ quiet: true });
}

export function resolveBaseUrl(app: AppConfig): string | undefined {
  return process.env[app.baseUrlVar] || app.defaultBaseUrl || undefined;
}

/** One Playwright project per app: its tests live in apps/<name>/tests. */
export function appProject(app: AppConfig): Project {
  return {
    name: app.name,
    testDir: `apps/${app.name}/tests`,
    use: {
      ...devices['Desktop Chrome'],
      baseURL: resolveBaseUrl(app),
      ...(app.testIdAttribute ? { testIdAttribute: app.testIdAttribute } : {}),
      app,
    } as Project['use'],
  };
}
