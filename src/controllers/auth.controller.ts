import {Request, Response} from 'express';
import {config} from '../config';
import prisma from "../prisma/prisma-client";
import * as authService from '../services/auth.service';

const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {user, refreshToken} = await authService.registerUser(
            req.body.email,
            req.body.password,
            req.body.name
        );

        const {accessToken} = authService.generateTokens(user.id);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: config.ACCESS_TOKEN_COOKIE_MAX_AGE
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: config.REFRESH_TOKEN_COOKIE_MAX_AGE
        });

        res.status(201).json({success: true, data: user});
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Registration failed'
        });
    }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {user, refreshToken} = await authService.loginUser(
            req.body.email,
            req.body.password
        );

        const {accessToken} = authService.generateTokens(user.id);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: config.ACCESS_TOKEN_COOKIE_MAX_AGE
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: config.REFRESH_TOKEN_COOKIE_MAX_AGE
        });

        res.status(200).json({
            success: true,
            data: user,
            // tokens: {
            //     accessToken,
            //     refreshToken
            // }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : 'Login failed'
        });
    }
};

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) throw new Error('User not authenticated');
        const user = await authService.getCurrentUser(req.user.id);
        res.status(200).json({success: true, data: user});
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : 'Authentication failed'
        });
    }
};

const refreshAccessToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) throw new Error('No refresh token');

        const user = await prisma.user.findFirst({
            where: {refreshToken}
        });

        if (!user) throw new Error('Invalid refresh token');

        const {accessToken, refreshToken: newRefreshToken} = authService.generateTokens(user.id);
        await authService.setRefreshToken(user.id, newRefreshToken);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: config.ACCESS_TOKEN_COOKIE_MAX_AGE
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: config.REFRESH_TOKEN_COOKIE_MAX_AGE
        });

        res.json({success: true, data: {accessToken}});
    } catch (error) {
        res.status(401).json({success: false, message: 'Invalid refresh token'});
    }
};

const logoutUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (userId) {
            await prisma.user.update({
                where: {id: userId},
                data: {refreshToken: null}
            });
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({success: true});
    } catch (error) {
        res.status(500).json({success: false, message: 'Logout failed'});
    }
};

export {registerUser, loginUser, getCurrentUser, logoutUser, refreshAccessToken};