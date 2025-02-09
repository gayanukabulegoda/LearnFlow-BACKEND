import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {config} from '../config';
import prisma from '../../src/prisma/prisma-client';
import {User} from '@prisma/client';
import {v4 as uuidv4} from 'uuid';
import logger from '../utils/logger';

export const generateTokens = (userId: number) => {
    const accessToken = jwt.sign(
        {id: userId},
        config.JWT_SECRET,
        {expiresIn: "15m"}
    );

    const refreshToken = uuidv4();
    return {accessToken, refreshToken};
};

export const setRefreshToken = async (userId: number, refreshToken: string) => {
    await prisma.user.update({
        where: {id: userId},
        data: {refreshToken}
    });
};

export type AuthUser = Pick<User, 'id' | 'email' | 'name'>;

export const registerUser = async (
    email: string,
    password: string,
    name?: string
): Promise<{ user: AuthUser; refreshToken: string }> => {
    const existingUser = await prisma.user.findUnique({where: {email}});
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: {email, password: hashedPassword, name},
        select: {id: true, email: true, name: true}
    });

    const {refreshToken} = generateTokens(user.id);
    await setRefreshToken(user.id, refreshToken);

    return {user, refreshToken};
};

export const loginUser = async (
    email: string,
    password: string
): Promise<{ user: AuthUser; refreshToken: string }> => {
    const user = await prisma.user.findUnique({
        where: {email},
        select: {id: true, email: true, name: true, password: true}
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }

    const {refreshToken} = generateTokens(user.id);
    await setRefreshToken(user.id, refreshToken);

    return {
        user: {id: user.id, email: user.email, name: user.name},
        refreshToken
    };
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