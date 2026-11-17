import type { APIRequestContext } from '@playwright/test';
import type { NewUser } from '../data/users';

interface ApiResult {
  responseCode: number;
  message: string;
}

/**
 * Test setup only (not API tests): creates and deletes throwaway accounts.
 * The API always answers HTTP 200; the real result is `responseCode` in the body.
 * The shared demo server sometimes answers with an HTML error page instead:
 * each call is tried up to 3 times before failing.
 */
export class AccountApi {
  constructor(private readonly request: APIRequestContext) {}

  async create(user: NewUser): Promise<void> {
    const body = await this.call('post', '/api/createAccount', {
      name: user.name,
      email: user.email,
      password: user.password,
      title: user.title,
      birth_date: user.birthDay,
      birth_month: user.birthMonth,
      birth_year: user.birthYear,
      firstname: user.firstName,
      lastname: user.lastName,
      company: user.company,
      address1: user.address1,
      address2: user.address2,
      country: user.country,
      zipcode: user.zipcode,
      state: user.state,
      city: user.city,
      mobile_number: user.mobile,
    });
    if (body.responseCode !== 201) throw new Error(`createAccount failed: ${JSON.stringify(body)}`);
  }

  /** Deletes the account if it still exists (a test may already have deleted it). */
  async deleteIfExists(user: NewUser): Promise<void> {
    const body = await this.call('delete', '/api/deleteAccount', { email: user.email, password: user.password });
    if (body.responseCode !== 200 && body.responseCode !== 404) {
      throw new Error(`deleteAccount failed: ${JSON.stringify(body)}`);
    }
  }

  private async call(method: 'post' | 'delete', url: string, form: Record<string, string>): Promise<ApiResult> {
    let last = '';
    for (let attempt = 1; attempt <= 3; attempt++) {
      const res = await this.request[method](url, { form });
      const text = await res.text();
      try {
        return JSON.parse(text) as ApiResult;
      } catch {
        last = `HTTP ${res.status()}: ${text.slice(0, 120)}`;
      }
    }
    throw new Error(`${url} did not return JSON after 3 attempts (${last})`);
  }
}
