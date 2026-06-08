import mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool: Pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'business_os',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});