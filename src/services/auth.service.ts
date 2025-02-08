import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {config} from '../config';
import prisma from '../../src/prisma/prisma-client';
import {User} from '@prisma/client';
import logger from '../utils/logger';

export type AuthUser = Pick<User, 'id' | 'email' | 'name'>;

export const registerUser = async (
    email: string,
    password: string,
    name?: string
): Promise<{ user: AuthUser; token: string }> => {
    try {
        const existingUser = await prisma.user.findUnique({where: {email}});
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: {email, password: hashedPassword, name},
            select: {id: true, email: true, name: true}
        });

        const token = jwt.sign({id: user.id}, config.JWT_SECRET, {
            expiresIn: "7d"
        });

        return {user, token};
    } catch (error) {
        logger.error('Registration service error:', error);
        throw error;
    }
};

export const loginUser = async (
    email: string,
    password: string
): Promise<{ user: AuthUser; token: string }> => {
    try {
        const user = await prisma.user.findUnique({
            where: {email},
            select: {id: true, email: true, name: true, password: true}
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({id: user.id}, config.JWT_SECRET, {
            expiresIn: "7d"
        });

        return {user: {id: user.id, email: user.email, name: user.name}, token};
    } catch (error) {
        logger.error('Login service error:', error);
        throw error;
    }
};

export const getCurrentUser = async (
    userId: number
): Promise<AuthUser | null> => {
    try {
        return await prisma.user.findUnique({
            where: {id: userId},
            select: {id: true, email: true, name: true}
        });
    } catch (error) {
        logger.error('Current user service error:', error);
        throw error;
    }
};