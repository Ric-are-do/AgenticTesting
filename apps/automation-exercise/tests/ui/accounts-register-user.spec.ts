// spec: apps/automation-exercise/specs/accounts.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Accounts', () => {
  test('Register User', async ({ homePage, newUser }) => {
    test.slow(); // many page loads on a slow shared demo site
    // 1. Open the home page
    await homePage.goto();
    await expect(homePage.hero).toBeVisible();

    // 2. Click 'Signup / Login' in the menu
    const login = await homePage.header.openSignupLogin();
    await expect(login.signupHeading).toBeVisible();

    // 3. Enter a name and a new email in [data-qa=signup-name] / [data-qa=signup-email] and click [data-qa=signup-button]
    const signup = await login.startSignup(newUser.name, newUser.email);
    await expect(signup.heading).toBeVisible();

    // 4. Fill title, password, date of birth, tick both checkboxes, fill the address fields; click [data-qa=create-account]
    const created = await signup.createAccount(newUser);
    await expect(created.heading).toHaveText('Account Created!', { ignoreCase: true });

    // 5. Click [data-qa=continue-button]
    const home = await created.continue();
    await expect(home.header.loggedInAs).toContainText(`Logged in as ${newUser.name}`);

    // 6. Click 'Delete Account'
    const deleted = await home.header.deleteAccount();
    await expect(deleted.heading).toHaveText('Account Deleted!', { ignoreCase: true });
    await deleted.continue();
  });
});
