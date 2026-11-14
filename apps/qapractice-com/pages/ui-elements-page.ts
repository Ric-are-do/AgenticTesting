import { expect, type Locator, type Page } from '@playwright/test';
import { SitePage } from './site-page';

/** /practice-different-ui-elements: one control per row, each with an "Output:" box. */
export class UiElementsPage extends SitePage {
  protected readonly path = '/practice-different-ui-elements';
  readonly textField: Locator;
  readonly textArea: Locator;
  readonly clickButton: Locator;
  readonly singleCheckbox: Locator;
  readonly singleDropdown: Locator;
  readonly multiDropdown: Locator;
  readonly link: Locator;
  readonly image: Locator;
  readonly nameHeader: Locator;
  readonly tooltipTrigger: Locator;
  readonly tooltip: Locator;
  readonly slider: Locator;
  readonly progressIncrement: Locator;
  readonly modalOpen: Locator;
  readonly modal: Locator;
  readonly datePicker: Locator;
  readonly fileUpload: Locator;
  readonly showNotification: Locator;
  readonly toast: Locator;
  /** Rows of the ID / Name / Age table, in display order. */
  readonly tableRows: Locator;
  /** The output box of the Tabs widget ("Active Tab: tab1"). */
  readonly tabsOutput: Locator;

  constructor(page: Page) {
    super(page);
    this.textField = page.getByTestId('ui-text-field');
    this.textArea = page.getByTestId('ui-textarea');
    this.clickButton = page.getByTestId('ui-click-button');
    this.singleCheckbox = page.getByTestId('ui-single-checkbox');
    this.singleDropdown = page.getByTestId('ui-single-dropdown');
    this.multiDropdown = page.getByTestId('ui-multi-dropdown');
    this.link = page.getByTestId('ui-link');
    this.image = page.getByTestId('ui-image');
    this.nameHeader = page.getByTestId('ui-th-name');
    this.tooltipTrigger = page.getByTestId('ui-tooltip-trigger');
    this.tooltip = page.getByRole('tooltip');
    this.slider = page.getByTestId('ui-slider');
    this.progressIncrement = page.getByTestId('ui-progress-increment');
    this.modalOpen = page.getByTestId('ui-modal-open');
    this.modal = page.getByRole('dialog');
    this.datePicker = page.getByTestId('ui-datepicker');
    this.fileUpload = page.getByTestId('ui-file-upload');
    this.showNotification = page.getByTestId('ui-show-notification');
    // Exact match: the same sentence also appears inside the page's test-case table.
    this.toast = page.getByText('Operation completed successfully.', { exact: true });
    // The table and the tabs widget have no test ids: first table on the page, and
    // the output box that reports the active tab.
    this.tableRows = page.locator('table').first().locator('tbody tr');
    this.tabsOutput = page.locator('.output-box', { hasText: 'Active Tab' });
  }

  async waitUntilLoaded() {
    await expect(this.clickButton).toBeVisible();
  }

  /**
   * The "Output:" box next to a control, by the control's test id. Output boxes
   * have no test id: they are `.output-box` inside the same `.row.mb-3` as the
   * control (the last one, as Dynamic Content has two).
   */
  output(controlTestId: string): Locator {
    return this.page
      .locator('div.row.mb-3')
      .filter({ has: this.page.getByTestId(controlTestId) })
      .locator('.output-box')
      .last();
  }

  checkbox(option: 1 | 2 | 3): Locator {
    return this.page.getByTestId(`ui-checkbox-option${option}`);
  }

  radio(n: 1 | 2 | 3): Locator {
    return this.page.getByTestId(`ui-radio-Radio ${n}`);
  }

  async clickTimes(n: number) {
    for (let i = 0; i < n; i++) await this.clickButton.click();
  }

  async openTab(name: string) {
    await this.page.getByText(name, { exact: true }).click();
  }

  async closeModal() {
    // Two buttons are named "Close" (the X and the footer); use the footer one.
    await this.modal.getByText('Close', { exact: true }).click();
  }
}
