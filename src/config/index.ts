import dotenv from 'dotenv';
import {cleanEnv, str, num} from 'envalid';

dotenv.config();

const config = cleanEnv(process.env, {
    NODE_ENV: str({choices: ['development', 'production'], default: 'development'}),
    PORT: num({default: 5000}),
    DATABASE_URL: str(),
    JWT_SECRET: str(),
    JWT_EXPIRES_IN: str({default: '7d'}),
    CLIENT_URL: str({default: 'http://localhost:5173'}),
});

export {config};