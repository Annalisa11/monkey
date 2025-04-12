const sqlite3 = require('sqlite3');
const path = require('path');

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
  db.run(`CREATE TABLE IF NOT EXISTS monkeys(
    monkey_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT DEFAULT 'active'
  )`);

  // QR codes table
  db.run(`CREATE TABLE IF NOT EXISTS qr_codes(
    qr_id TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by_monkey_id INTEGER NOT NULL,
    destination_monkey_id INTEGER NOT NULL,
    destination_location TEXT NOT NULL,
    scanned BOOLEAN DEFAULT 0,
    scanned_at DATETIME,
    scanned_by_monkey_id INTEGER,
    journey_completed BOOLEAN DEFAULT 0,
    FOREIGN KEY (created_by_monkey_id) REFERENCES monkeys(monkey_id),
    FOREIGN KEY (destination_monkey_id) REFERENCES monkeys(monkey_id)
  )`);

  // Rewards table
  db.run(`CREATE TABLE IF NOT EXISTS rewards(
    reward_id INTEGER PRIMARY KEY AUTOINCREMENT,
    qr_id TEXT NOT NULL,
    issued BOOLEAN DEFAULT 0,
    issued_at DATETIME,
    FOREIGN KEY (qr_id) REFERENCES qr_codes(qr_id)
  )`);

  // Settings table
  db.run(`CREATE TABLE IF NOT EXISTS settings(
    setting_id INTEGER PRIMARY KEY AUTOINCREMENT,
    monkey_id INTEGER NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY (monkey_id) REFERENCES monkeys(monkey_id)
  )`);

  // Stats table
  db.run(`CREATE TABLE IF NOT EXISTS stats(
    stat_id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    monkey_id INTEGER NOT NULL,
    qr_scans_count INTEGER DEFAULT 0,
    successful_navigations INTEGER DEFAULT 0,
    rewards_issued INTEGER DEFAULT 0,
    FOREIGN KEY (monkey_id) REFERENCES monkeys(monkey_id)
  )`);

  console.log('Database initialized');
};

initDb();

export { db };
