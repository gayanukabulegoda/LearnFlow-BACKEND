import {Request, Response} from 'express';
import {config} from '../config';
import * as authService from '../services/auth.service';

const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user, token } = await authService.registerUser(
            req.body.email,
            req.body.password,
            req.body.name
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Registration failed'
        });
    }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user, token } = await authService.loginUser(
            req.body.email,
            req.body.password
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ success: true, data: user });
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
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : 'Authentication failed'
        });
    }
};

const logoutUser = (req: Request, res: Response): void => {
    res.clearCookie('token');
    res.status(200).json({success: true, message: 'Logged out successfully'});
};

export {registerUser, loginUser, getCurrentUser, logoutUser};