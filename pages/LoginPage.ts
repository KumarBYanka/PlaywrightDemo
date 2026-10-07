import { expect, Page } from '@playwright/test';
import { Logger } from '../utils/logger';

export class LoginPage {

  private readonly usernameInput;
  private readonly passwordInput;
  private readonly loginButton;
  private readonly errorMessage;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByPlaceholder('Enter your email');
    this.passwordInput = page.getByPlaceholder('Enter your password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('mat-error');
  }

  async navigate(): Promise<void> {
    Logger.info('Navigating to Login page');

    await this.page.goto('/login');
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async login(
    username: string,
    password: string
  ): Promise<void> {

    Logger.info('Performing login');

    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async verifyLoginError(message: string): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }
}