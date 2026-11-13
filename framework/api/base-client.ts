import type { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseApiClient {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly headers: Record<string, string> = {},
  ) {}

  protected async getJson<T>(url: string): Promise<T> {
    return this.parse<T>('GET', url, await this.request.get(url, { headers: this.headers }));
  }

  protected async postJson<T>(url: string, data: unknown): Promise<T> {
    return this.parse<T>('POST', url, await this.request.post(url, { headers: this.headers, data }));
  }

  private async parse<T>(method: string, url: string, res: APIResponse): Promise<T> {
    if (!res.ok()) {
      const body = (await res.text()).slice(0, 300);
      throw new Error(`${method} ${url} failed: ${res.status()} ${body}`);
    }
    return (await res.json()) as T;
  }
}
