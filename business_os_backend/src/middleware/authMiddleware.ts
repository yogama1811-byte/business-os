import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        res.status(401).json({ success: false, message: 'Missing authorization token.' });
        return;
    }

    try {
        const payload = authService.verifyToken(token);
        const request = req as Request & { user?: typeof payload };
        request.user = payload;
        next();
    } catch (error: any) {
        res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};
