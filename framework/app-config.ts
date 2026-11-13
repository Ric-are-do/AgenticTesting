export interface UserSpec {
  usernameVar: string;
  passwordVar: string;
  /** Only when the user approved defaults for this app. */
  defaultUsername?: string;
  defaultPassword?: string;
}

export interface AppConfig {
  name: string;
  baseUrlVar: string;
  /** A URL is not a secret: fine to default. */
  defaultBaseUrl?: string;
  testIdAttribute?: string;
  /** Omit both for an app with no login. */
  defaultUser?: string;
  users?: Record<string, UserSpec>;
}

export interface Credentials {
  username: string;
  password: string;
}

export function resolveBaseUrl(app: AppConfig): string | undefined {
  return process.env[app.baseUrlVar] || app.defaultBaseUrl || undefined;
}

export function resolveUser(
  app: AppConfig,
  user?: string,
): { name: string; credentials?: Credentials; missing: string[] } {
  if (!app.users || !app.defaultUser) throw new Error(`App ${app.name} has no users`);
  const name = user ?? app.defaultUser;
  const spec = app.users[name];
  if (!spec) throw new Error(`Unknown user "${name}" for app ${app.name}`);
  const username = process.env[spec.usernameVar] || spec.defaultUsername;
  const password = process.env[spec.passwordVar] || spec.defaultPassword;
  const missing: string[] = [];
  if (!username) missing.push(spec.usernameVar);
  if (!password) missing.push(spec.passwordVar);
  return { name, credentials: missing.length ? undefined : { username: username!, password: password! }, missing };
}
