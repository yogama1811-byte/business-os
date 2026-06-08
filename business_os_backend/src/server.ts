import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Essential body parser integration

// Middleware Routes Context binding
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server engine operating smoothly on port: ${PORT}`);
});