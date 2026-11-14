// spec: apps/qapractice-com/specs/ui-elements.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Complex and advanced components', () => {
  test('File selection shows the file name', async ({ uiElementsPage }) => {
    // 1. Choose sample.txt in the file input.
    await uiElementsPage.goto();
    await uiElementsPage.fileUpload.setInputFiles({ name: 'sample.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') });
    await expect(uiElementsPage.output('ui-file-upload')).toContainText('File "sample.txt" selected');
  });
});
