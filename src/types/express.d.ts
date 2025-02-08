import {User} from '../../src/prisma/prisma-client';

declare global {
    namespace Express {
        interface Request {
            user?: Pick<User, 'id' | 'email' | 'name'>;
        }
    }
}