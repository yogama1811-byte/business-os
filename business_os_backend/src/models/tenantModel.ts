import { pool } from '../config/db.js';

export interface TenantInput {
    company_name: string;
}

export const TenantModel = {
    // 1. Core tenant registry insert
    createTenant: async (tenantData: TenantInput): Promise<number> => {
        const [result] = await pool.execute(
            'INSERT INTO tenants (company_name) VALUES (?)',
            [tenantData.company_name]
        );
        // Cast as any to read primary identity key insertId
        return (result as any).insertId;
    }
};