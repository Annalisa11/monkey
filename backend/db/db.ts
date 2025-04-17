import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.resolve(__dirname, 'monkey.db');

const sqlite = new Database(dbPath);
const db = drizzle(sqlite, { schema });

export const pingDB = (): void => {
  try {
    sqlite.exec(`SELECT 1`);
    console.log('✅ Database connection successful');
  } catch (err: any) {
    console.error('❌ Database connection error:', err.message);
  }
};

export default db;
