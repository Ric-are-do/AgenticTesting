import type { AppConfig } from '@core/app';

/** Thatha Zonke, a local food-ordering marketplace (Django). No data-testid
 *  on the site, so locators use role/text; no custom testIdAttribute. */
export const thathaZonke: AppConfig = {
  name: 'thatha-zonke',
  baseUrlVar: 'THATHA_ZONKE_URL',
  defaultBaseUrl: 'https://thathazonke-rl1d.onrender.com',
};
