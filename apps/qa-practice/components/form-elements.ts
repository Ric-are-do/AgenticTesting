import type { Locator, Page } from '@playwright/test';

/** Radix widgets: the select is role=combobox, the boxes are role=checkbox (state in aria-checked). */
export class FormElements {
  readonly root: Locator;
  readonly country: Locator;
  readonly countryOptions: Locator;
  readonly terms: Locator;
  readonly newsletter: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.root = page.getByTestId('elements-form');
    this.country = page.locator('#select-country');
    this.countryOptions = page.getByRole('option');
    this.terms = page.locator('#terms-checkbox');
    this.newsletter = page.locator('#newsletter-checkbox');
    this.submitButton = page.locator('#elements-submit');
  }

  async openCountries(): Promise<void> {
    await this.country.click();
  }

  async chooseCountry(name: string): Promise<void> {
    await this.openCountries();
    await this.page.getByRole('option', { name, exact: true }).click();
  }

  async toggleTerms(): Promise<void> {
    await this.terms.click();
  }

  async toggleNewsletter(): Promise<void> {
    await this.newsletter.click();
  }
}
