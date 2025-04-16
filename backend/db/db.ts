import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type ErrorCallback = (err: Error | null) => void;

const connected: ErrorCallback = (err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Connected to the monkey database');
};

const sql3 = sqlite3.verbose();
const dbPath = path.resolve(__dirname, 'monkey.db');
const db = new sql3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  connected
);

const initDb = () => {
  // Monkeys table
  db.run(
    `CREATE TABLE IF NOT EXISTS monkeys(
    monkey_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location_id INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT 0,
    address TEXT,
    FOREIGN KEY (location_id) REFERENCES locations(id)

  )`
  );

  // Navigation QR codes table for verification
  db.run(`
CREATE TABLE IF NOT EXISTS navigation_qr_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL UNIQUE,
  route_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  is_verified BOOLEAN DEFAULT 0,
  scanned INTEGER DEFAULT 0,
  FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE CASCADE
)`);

  db.run(`CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )`);

  // Routes table to store directed routes between locations
  db.run(`
    CREATE TABLE IF NOT EXISTS routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_location_id INTEGER NOT NULL,
      destination_location_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      is_accessible BOOLEAN DEFAULT 1,
      FOREIGN KEY (source_location_id) REFERENCES locations(id) ON DELETE CASCADE,
      FOREIGN KEY (destination_location_id) REFERENCES locations(id) ON DELETE CASCADE,
      UNIQUE(source_location_id, destination_location_id)
    )
  `);

  // Stats table
  db.run(`
    CREATE TABLE IF NOT EXISTS button_press_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      monkey_id INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      location_id INTEGER NOT NULL,
      FOREIGN KEY (location_id) REFERENCES locations(id)
    )
  `);

  db.run(`CREATE TABLE IF NOT EXISTS journey_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL
  )`);

  console.log('Database initialized');
};

initDb();

export default db;
