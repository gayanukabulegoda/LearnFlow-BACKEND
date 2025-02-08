import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import {config} from './config';
import authRoutes from './routes/auth.routes';
import goalsRoutes from './routes/goals.routes';
import resourcesRoutes from './routes/resources.routes';
import {errorHandler} from './middleware/error.middleware';
import {notFoundHandler} from './middleware/not-found.middleware';

const app = express();

// Middleware pipeline
app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors({
    origin: config.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({status: 'ok'});
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/resources', resourcesRoutes);

// Error handling
app.use(notFoundHandler);
// app.use(errorHandler);

export default app;