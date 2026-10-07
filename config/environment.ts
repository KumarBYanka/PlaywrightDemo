import dotenv from 'dotenv';
import path from 'path';

export type Environment = 'qa' | 'preprod' | 'prod';

export type BrowserType = 'chromium' | 'firefox' | 'webkit';

interface UserCredentials {
    username: string;
    password: string;
}

export interface EnvironmentConfig {
    name: Environment;
    baseUrl: string;
    apiUrl: string;
    apiToken?: string;
    timeout: number;
    retries: number;
    headless: boolean;
    browser: BrowserType;
    logLevel: 'debug' | 'info' | 'warn' | 'error';

    user: UserCredentials;
    adminUser: UserCredentials;
}

/**
 * Get environment name from ENVIRONMENT variable.
 * Defaults to QA.
 */
const environmentName = (
    process.env.ENVIRONMENT?.toLowerCase() || 'qa'
) as Environment;

/**
 * Validate environment name.
 */
const validEnvironments: Environment[] = [
    'qa',
    'preprod',
    'prod',
];

if (!validEnvironments.includes(environmentName)) {
    throw new Error(
        `Invalid ENVIRONMENT: "${environmentName}". ` +
        `Expected one of: ${validEnvironments.join(', ')}`
    );
}

/**
 * Load environment-specific configuration.
 */
const envFile = path.resolve(
    __dirname,
    `${environmentName}.env`
);

dotenv.config({
    path: envFile,
});

/**
 * Get required environment variable.
 */
function required(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `Required environment variable "${name}" is not configured.`
        );
    }

    return value;
}

/**
 * Get numeric environment variable.
 */
function numberValue(
    name: string,
    defaultValue: number
): number {
    const value = process.env[name];

    if (!value) {
        return defaultValue;
    }

    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
        throw new Error(
            `Environment variable "${name}" must be a number.`
        );
    }

    return parsed;
}

/**
 * Get boolean environment variable.
 */
function booleanValue(
    name: string,
    defaultValue: boolean
): boolean {
    const value = process.env[name];

    if (!value) {
        return defaultValue;
    }

    if (value === 'true') {
        return true;
    }

    if (value === 'false') {
        return false;
    }

    throw new Error(
        `Environment variable "${name}" must be true or false.`
    );
}

/**
 * Get a bearer token, normalised for use in an Authorization header.
 * Pasted tokens often carry quotes, a "Bearer " prefix or line breaks,
 * none of which are valid inside the header value.
 */
function tokenValue(name: string): string | undefined {
    const value = process.env[name];

    if (!value) {
        return undefined;
    }

    const token = value
        .trim()
        .replace(/^["']|["']$/g, '')
        .trim()
        .replace(/^Bearer\s+/i, '')
        .replace(/\s+/g, '');

    return token || undefined;
}

/**
 * Validate browser.
 */
function getBrowser(): BrowserType {
    const browser = process.env.BROWSER || 'chromium';

    if (
        browser !== 'chromium' &&
        browser !== 'firefox' &&
        browser !== 'webkit'
    ) {
        throw new Error(
            `Invalid BROWSER: "${browser}". ` +
            `Expected chromium, firefox or webkit.`
        );
    }

    return browser;
}

/**
 * Validate log level.
 */
function getLogLevel(): EnvironmentConfig['logLevel'] {
    const level = process.env.LOG_LEVEL || 'info';

    if (
        level !== 'debug' &&
        level !== 'info' &&
        level !== 'warn' &&
        level !== 'error'
    ) {
        throw new Error(
            `Invalid LOG_LEVEL: "${level}".`
        );
    }

    return level;
}

/**
 * Central environment configuration.
 */
const environment: EnvironmentConfig = {
    name: environmentName,

    baseUrl: required('BASE_URL'),

    apiUrl: required('API_URL'),

    // Bearer token for API tests. Optional so UI-only runs don't need it;
    // read from API_TOKEN in config/<ENVIRONMENT>.env (e.g. qa.env).
    apiToken: tokenValue('API_TOKEN'),

    timeout: numberValue(
        'TEST_TIMEOUT',
        30000
    ),

    retries: numberValue(
        'TEST_RETRIES',
        1
    ),

    headless: booleanValue(
        'HEADLESS',
        true
    ),

    browser: getBrowser(),

    logLevel: getLogLevel(),

    user: {
        username: required('LOGIN_USERNAME'),
        password: required('LOGIN_PASSWORD'),
    },

    adminUser: {
        username: required('ADMIN_USERNAME'),
        password: required('ADMIN_PASSWORD'),
    },
};

export default environment;