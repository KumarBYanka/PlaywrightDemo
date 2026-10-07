import { APIRequestContext, APIResponse } from '@playwright/test';
import environment from '../../../config/environment';
import { Logger } from '../../../utils/logger';

export class LicenseClient {

  constructor(
    private readonly request: APIRequestContext
  ) {}

  async getCustomers(): Promise<APIResponse> {

    Logger.info('Calling License Management Customers API');

    // Token comes from API_TOKEN in config/<ENVIRONMENT>.env (e.g. qa.env).
    if (!environment.apiToken) {
      throw new Error(`API_TOKEN is not configured in config/${environment.name}.env`);
    }

    return await this.request.get(
      `${environment.apiUrl}/license-management/v1/customers`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${environment.apiToken}`
        }
      }
    );
  }
}
