import dotenv from 'dotenv';

dotenv.config();

// env
export const PORT = Number(process.env.PORT) || 7000;
export const DB_URL = process.env.DB_URL;
