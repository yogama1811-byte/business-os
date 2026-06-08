import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { TenantModel } from '../models/tenantModel.js';
import { UserModel } from '../models/userModel.js';

export const authController = {
    registerCompany: async (req: Request, res: Response): Promise<void> => {
        try {
            const { company_name, admin_name, email, password } = req.body;

            // 1. Input Guardrail validation
            if (!company_name || !admin_name || !email || !password) {
                res.status(400).json({ success: false, message: "Ellaa fields-um mukkiyam pa!" });
                return;
            }

            // 2. Security Check: Unique Email Verification
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                res.status(400).json({ success: false, message: "Intha email already register aayiruku pa!" });
                return;
            }

            // 3. Operation A: Create Tenant (Company)
            const newTenantId = await TenantModel.createTenant({ company_name });

            // 4. Security Layer: Hash the plaintext password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 5. Operation B: Create Admin User linked to this Tenant
            const newUserId = await UserModel.createUser({
                tenant_id: newTenantId,
                role_id: 2, // Explicitly hardcoded 2 = Company Admin
                name: admin_name,
                email: email,
                password_hash: hashedPassword
            });

            // 6. Final success execution trigger response
            res.status(201).json({
                success: true,
                message: "SaaS Tenant and Admin profile configured successfully!",
                data: {
                    tenantId: newTenantId,
                    userId: newUserId,
                    company: company_name,
                    admin: admin_name
                }
            });

        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};