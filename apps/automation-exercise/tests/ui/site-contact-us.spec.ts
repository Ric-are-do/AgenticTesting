// spec: apps/automation-exercise/specs/site.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import path from 'path';
import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Site pages', () => {
  test('Contact Us Form', async ({ homePage }) => {
    // 1. Open the home page and click 'Contact us'
    await homePage.goto();
    const contact = await homePage.header.openContactUs();
    await expect(contact.heading).toBeVisible();

    // 2. Enter name, email, subject and message, upload a small text file, submit and press OK
    await contact.send({
      name: 'QA Tester',
      email: 'qa.contact@example.com',
      subject: 'Automated test',
      message: 'Automated Playwright test message, please ignore.',
      file: path.join(__dirname, '../../data/contact-upload.txt'),
    });
    await expect(contact.successMessage).toBeVisible();

    // 3. Click 'Home'
    const home = await contact.goHome();
    await expect(home.hero).toBeVisible();
  });
});
