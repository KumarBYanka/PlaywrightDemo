# PlayWrightE-2-E

End-to-end test automation for the Noedra Node web application, written in TypeScript with [Playwright](https://playwright.dev/). The suite covers UI flows (login with OTP) and REST API checks with JSON schema validation.

## Tech stack

| Area | Tooling |
| --- | --- |
| Test runner | `@playwright/test` (Chromium) |
| Language | TypeScript |
| Configuration | `dotenv`, per-environment `.env` files |
| Schema validation | `ajv` + `ajv-formats` |
| Reporting | Playwright list + HTML reporters, Allure |

## Project structure

```
config/
  environment.ts        Loads and validates config/<ENVIRONMENT>.env
  qa.env                QA settings and credentials (not to be committed)
data/                   Test data (login users, equipment ids)
fixtures/
  test-fixtures.ts      Extends Playwright `test` with page-object fixtures
pages/                  Page objects (LoginPage, OtpPage)
tests/
  ui/                   Browser tests
  api/
    clients/            API clients, one per service
    schemas/            JSON schemas for API responses
    *.spec.ts           API tests
utils/
  logger.ts             Timestamped console logger
  schemaValidator.ts    Ajv wrapper returning readable violations
playwright.config.ts    Runner, reporter and browser settings
```

## Prerequisites

- Node.js 20 or later (required by the installed Playwright version)
- Java 8 or later, only if you want to generate Allure reports

## Setup

```bash
npm install
npx playwright install chromium
```

Then create or update `config/qa.env` (see below).

## Configuration

The target environment is chosen by the `ENVIRONMENT` variable (`qa`, `preprod` or `prod`; default `qa`). `config/environment.ts` loads `config/<ENVIRONMENT>.env` and fails fast if a required value is missing. Only `qa.env` exists today; add `preprod.env` or `prod.env` with the same keys to target those environments.

| Variable | Required | Purpose |
| --- | --- | --- |
| `BASE_URL` | Yes | Web application URL, used as Playwright `baseURL` |
| `API_URL` | Yes | API gateway base URL |
| `LOGIN_USERNAME`, `LOGIN_PASSWORD` | Yes | Standard test user |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Yes | Admin test user |
| `API_TOKEN` | For API tests | Bearer token for API calls (see below) |
| `HEADLESS` | No | `true` / `false`, default `true` |
| `LOG_LEVEL` | No | `debug`, `info`, `warn` or `error`, default `info` |

`environment.ts` also reads `TEST_TIMEOUT`, `TEST_RETRIES` and `BROWSER`, but `playwright.config.ts` does not use them yet: timeouts and retries are set directly in the config and only the Chromium project is defined.

### API token

Login is protected by OTP, so API tests cannot obtain a token themselves. Before running them:

1. Log in to the QA application in a browser.
2. Copy a valid bearer token for the logged-in user (for example from the `Authorization` header of an API request in DevTools → Network).
3. Paste it as `API_TOKEN=<token>` in `config/qa.env`. Quotes, a leading `Bearer ` and line breaks are stripped automatically.

Tokens expire after about an hour. An expired or wrong token produces `403 {"additionalInformation":"InvalidToken"}`. If `API_TOKEN` is empty, the API tests are skipped.

### Handling secrets

`*.env` files contain credentials and tokens. Do not commit them, share them in chat or paste them into tickets. `config/*.env` is listed in `.gitignore`; in CI, provide the values through the secret store.

## Running tests

```bash
npm test                         # all tests
npx playwright test tests/api    # API tests only
npx playwright test tests/ui     # UI tests only
npm run test:headed              # with a visible browser
npm run test:ui                  # Playwright UI mode
npm run test:debug               # Playwright inspector
```

To target another environment from PowerShell:

```powershell
$env:ENVIRONMENT = 'preprod'; npx playwright test
```

### Manual OTP step

`tests/ui/login.spec.ts` › "should login successfully with valid credentials" needs a person to type the 6-digit OTP into the browser. Run it headed (`npm run test:headed -- tests/ui/login.spec.ts`). The test waits up to two minutes for the OTP, then submits automatically. It cannot run unattended in CI.

## Test coverage

| Spec | Type | What it checks |
| --- | --- | --- |
| `tests/ui/login.spec.ts` | UI | Successful login through OTP reaches the dashboard; invalid credentials show "Incorrect username or password." |
| `tests/api/license-customers.spec.ts` | API | `GET /license-management/v1/customers` returns 200 JSON matching `licenseCustomers.schema.ts` |

## Reports

- **HTML:** written to `playwright-report/`. Open with `npx playwright show-report`.
- **Allure:** results are written to `allure-results/`. Generate and open with `npm run report` (requires Java).
- On failure Playwright keeps screenshots and videos in `test-results/`; traces are recorded on the first retry.

## Adding tests

**UI:** add a page object under `pages/`, register it as a fixture in `fixtures/test-fixtures.ts`, and import `test`/`expect` from the fixtures file in your spec.

**API:**

1. Add a client under `tests/api/clients/` that builds requests from `environment.apiUrl` and `environment.apiToken`.
2. Add a JSON schema under `tests/api/schemas/`, derived from a real response. Allow `null` where the API returns it.
3. In the spec, assert the status code, then call `SchemaValidator.validate(schema, body)` and expect an empty list of errors.

Keep spec files directly under `tests/api/` (not inside `clients/`), as their relative imports depend on that location.

## MCP

`.mcp.json` registers the Playwright MCP server (`@playwright/mcp`) so AI coding assistants can drive a browser when exploring the application.
