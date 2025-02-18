import {User} from '../../src/prisma/prisma-client';
/**
 * @description Global declaration to extend the Request interface to include user property in req
 */
declare global {
    namespace Express {
        interface Request {
            user?: Pick<User, 'id' | 'email' | 'name'>;
        }
    }
}