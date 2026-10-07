import { test, expect } from "../../fixtures/test-fixtures";
import { loginData } from "../../data/login.data";

test.describe("Login Tests", () => {
  test("should login successfully with valid credentials", async ({
    loginPage,
    otpPage,
    page,
  }) => {
    // The OTP is typed manually in the browser; give that enough real time.
    test.setTimeout(180 * 1000);

    await loginPage.navigate();

    await loginPage.login(
      loginData.validUser.username,
      loginData.validUser.password,
    );

    await otpPage.waitForOtpScreen();
    await otpPage.focusFirstDigit();

    // Waits for the 6 digits to be typed in manually, then submits automatically.
    await otpPage.waitForManualEntryAndSubmit();

    await expect(page).toHaveURL(/dashboard/);
  });

  test("should display error for invalid credentials", async ({
    loginPage,
  }) => {
    await loginPage.navigate();

    await loginPage.login(
      loginData.invalidUser.username,
      loginData.invalidUser.password,
    );

    await loginPage.verifyLoginError("Incorrect username or password.");
  });
});
