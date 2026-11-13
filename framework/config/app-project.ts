import type { Project } from '@playwright/test';
import { devices } from '@playwright/test';
import { AppConfig, resolveBaseUrl } from '../app-config';

export function appProject(app: AppConfig): Project {
  return {
    name: app.name,
    testDir: `tests/${app.name}`,
    use: {
      ...devices['Desktop Chrome'],
      baseURL: resolveBaseUrl(app),
      testIdAttribute: app.testIdAttribute ?? 'data-testid',
      app,
    } as Project['use'],
  };
}
