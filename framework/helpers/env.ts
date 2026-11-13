import dotenv from 'dotenv';

/** Loads .env if present; a missing file is fine (CI has none). */
export function loadDotEnv(): void {
  dotenv.config({ quiet: true });
}

export function missingVars(names: string[]): string[] {
  return names.filter((n) => !process.env[n]);
}
