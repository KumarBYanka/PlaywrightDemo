import { expect, Page } from '@playwright/test';
import { Logger } from '../utils/logger';

export class OtpPage {

  private readonly firstDigitInput;
  private readonly submitButton;

  constructor(private readonly page: Page) {
    this.firstDigitInput = page.getByRole('textbox', { name: 'Digit 1 of 6' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async waitForOtpScreen(): Promise<void> {
    Logger.info('Waiting for OTP screen');

    await expect(this.page).toHaveURL(/otp/);
  }

  async focusFirstDigit(): Promise<void> {
    Logger.info('Focusing first OTP digit input');

    await this.firstDigitInput.click();
  }

  async waitForManualEntryAndSubmit(timeoutMs = 120_000): Promise<void> {
    Logger.info('Waiting for the OTP to be entered manually');

    await expect(this.submitButton).toBeEnabled({ timeout: timeoutMs });

    Logger.info('Submitting OTP');

    await this.submitButton.click();
  }
}
