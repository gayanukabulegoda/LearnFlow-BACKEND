import dotenv from 'dotenv';
import {cleanEnv, str, num} from 'envalid';
/**
 * @description Load environment variables from .env file
 * @exports config
 */
dotenv.config();

const config = cleanEnv(process.env, {
    NODE_ENV: str({choices: ['development', 'production'], default: 'development'}),
    PORT: num({default: 5000}),
    DATABASE_URL: str(),
    JWT_SECRET: str(),
    JWT_EXPIRES_IN: str({default: '7d'}),
    ACCESS_TOKEN_EXPIRES_IN: str({default: '15m'}),
    REFRESH_TOKEN_EXPIRES_IN: str({default: '7d'}),
    ACCESS_TOKEN_COOKIE_MAX_AGE: num({default: 7 * 24 * 60 * 60 * 1000}), // 7 days
    REFRESH_TOKEN_COOKIE_MAX_AGE: num({default: 30 * 24 * 60 * 60 * 1000}), // 30 days
    CLIENT_URL: str({default: 'http://localhost:5173'}),
    CURRENT_API_VERSION: str({default: 'v1'})
});

export {config};