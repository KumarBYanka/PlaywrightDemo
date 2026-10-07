import { test, expect } from '@playwright/test';
import environment from '../../config/environment';
import { SchemaValidator } from '../../utils/schemaValidator';
import { LicenseClient } from './clients/LicenseClient';
import { licenseCustomersSchema } from './schemas/licenseCustomers.schema';

test.describe('License Management API - GET /license-management/v1/customers', () => {

  // Login is behind OTP, so the token cannot be obtained in-test.
  test.skip(!environment.apiToken, 'API_TOKEN is not set');

  test('should return 200 and a response matching the JSON schema', async ({ request }) => {
    const licenseClient = new LicenseClient(request);

    const response = await licenseClient.getCustomers();

    expect(response.status(), await response.text()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();

    const schemaErrors = SchemaValidator.validate(
      licenseCustomersSchema,
      body
    );

    expect(schemaErrors, 'Response does not match JSON schema').toEqual([]);
  });
});
