import type { Request, Response } from 'express';
import { authService } from '../services/authService.js';

export const authController = {
    registerCompany: async (req: Request, res: Response): Promise<void> => {
        try {
            const { company_name, admin_name, email, password } = req.body;

            if (!company_name || !admin_name || !email || !password) {
                res.status(400).json({ success: false, message: 'All fields are required.' });
                return;
            }

            const registrationResult = await authService.registerCompany({
                company_name,
                admin_name,
                email,
                password
            });

            res.status(201).json({
                success: true,
                message: 'Tenant registration completed successfully.',
                data: registrationResult
            });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    login: async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ success: false, message: 'Email and password are required.' });
                return;
            }

            const loginResult = await authService.login(email, password);

            res.status(200).json({
                success: true,
                message: 'Login successful.',
                data: {
                    token: loginResult.token,
                    user: {
                        id: loginResult.user.user_id,
                        name: loginResult.user.name,
                        email: loginResult.user.email,
                        tenantId: loginResult.user.tenant_id,
                        roleId: loginResult.user.role_id
                    }
                }
            });
        } catch (error: any) {
            res.status(401).json({ success: false, error: error.message });
        }
    }
};