// spec: apps/qapractice-com/specs/ui-elements.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Interactive elements', () => {
  test('Slider reports its value', async ({ uiElementsPage }) => {
    // 1. Open the page.
    await uiElementsPage.goto();
    await expect(uiElementsPage.output('ui-slider')).toHaveText('Slider Value: 50');

    // 2. Set the slider to 0, then 100.
    await uiElementsPage.slider.fill('0');
    await expect(uiElementsPage.output('ui-slider')).toHaveText('Slider Value: 0');
    await uiElementsPage.slider.fill('100');
    await expect(uiElementsPage.output('ui-slider')).toHaveText('Slider Value: 100');
  });
});
