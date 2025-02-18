import app from './app';
import {createServer} from 'http';
import logger from './utils/logger';
import {config} from './config/config';
/**
 * -------------------------------------------------------------------
 * Author: Gayanuka Bulegoda
 * GitHub: https://github.com/gayanukabulegoda
 * Website: https://grbulegoda.me
 * -------------------------------------------------------------------
 * Created: 04-02-2025 18:32 PM
 * Project: LearnFlow BACKEND
 * -------------------------------------------------------------------
 */
const port = config.PORT || 5000;
const server = createServer(app);

const startServer = async () => {
    try {
        server.listen(port, () => {
            logger.info(`Server running on port ${port}`);
            logger.info(`Environment: ${config.NODE_ENV}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
const shutdown = () => {
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();