import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TenantModel } from '../models/tenantModel.js';
import { UserModel } from '../models/userModel.js';
import type { UserInput } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';
const JWT_EXPIRES_IN = '1h';

export const authService = {
    async registerCompany(payload: {
        company_name: string;
        admin_name: string;
        email: string;
        password: string;
    }) {
        const existingUser = await UserModel.findByEmail(payload.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const newTenantId = await TenantModel.createTenant({ company_name: payload.company_name });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(payload.password, salt);

        const newUserId = await UserModel.createUser({
            tenant_id: newTenantId,
            role_id: 2,
            name: payload.admin_name,
            email: payload.email,
            password_hash: hashedPassword
        } as UserInput);

        const token = authService.generateToken({
            userId: newUserId,
            tenantId: newTenantId,
            roleId: 2
        });

        return {
            tenantId: newTenantId,
            userId: newUserId,
            token
        };
    },

    async login(email: string, password: string) {
        const existingUser = await UserModel.findByEmail(email);
        if (!existingUser) {
            throw new Error('Invalid credentials');
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password_hash);
        if (!passwordMatch) {
            throw new Error('Invalid credentials');
        }

        const token = authService.generateToken({
            userId: existingUser.user_id,
            tenantId: existingUser.tenant_id,
            roleId: existingUser.role_id
        });

        return {
            user: existingUser,
            token
        };
    },

    generateToken(payload: { userId: number; tenantId: number; roleId: number }) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    },

    verifyToken(token: string) {
        return jwt.verify(token, JWT_SECRET) as {
            userId: number;
            tenantId: number;
            roleId: number;
            iat: number;
            exp: number;
        };
    }
};
