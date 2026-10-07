import {
  test as base,
  expect
} from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { OtpPage } from '../pages/OtpPage';

type Fixtures = {
  loginPage: LoginPage;
  otpPage: OtpPage;
};

export const test = base.extend<Fixtures>({

  loginPage: async ({ page }, use) => {

    const loginPage = new LoginPage(page);

    await use(loginPage);
  },

  otpPage: async ({ page }, use) => {

    const otpPage = new OtpPage(page);

    await use(otpPage);
  }

});

export { expect };