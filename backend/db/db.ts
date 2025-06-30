import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as schema from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use different database file for tests
const dbFileName =
  process.env.NODE_ENV === 'test' ? 'monkey-test.db' : 'monkey.db';
const dbPath = path.resolve(__dirname, dbFileName);

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
