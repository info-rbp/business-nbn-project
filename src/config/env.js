const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL || 'http://localhost:3000',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
    ALLOW_MOCK_SERVICEABILITY: process.env.ALLOW_MOCK_SERVICEABILITY === 'true',
    DATABASE_URL: process.env.DATABASE_URL,
    SQLITE_PATH: process.env.SQLITE_PATH || path.join(__dirname, '../../database.sqlite'),
    CORS_ORIGIN: process.env.CORS_ORIGIN || process.env.PUBLIC_BASE_URL || 'http://localhost:3000',
    SESSION_SECRET: process.env.SESSION_SECRET || 'replace_me',
};

// Validation for production
if (isProduction) {
    if (!config.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is required in production');
    }
    if (!process.env.PUBLIC_BASE_URL) {
        throw new Error('PUBLIC_BASE_URL is required in production');
    }
    if (!config.DATABASE_URL && !process.env.SQLITE_PATH) {
        // We allow SQLITE_PATH if explicitly provided, but usually DATABASE_URL is preferred for cloud
        console.warn('Production: Using SQLite. Ensure persistent volume is configured.');
    }
    if (!config.RAPIDAPI_KEY && !config.ALLOW_MOCK_SERVICEABILITY) {
        throw new Error('RAPIDAPI_KEY is required in production unless ALLOW_MOCK_SERVICEABILITY is true');
    }
}

module.exports = config;
