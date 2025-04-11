const sqlite3 = require('sqlite3');
const path = require('path');

type ErrorCallback = (err: Error | null) => void;

const connected: ErrorCallback = (err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Created the db or it already exists.');
};

const sql3 = sqlite3.verbose();

const dbPath = path.resolve(__dirname, 'data.db');
const db = new sql3.Database(dbPath, sqlite3.OPEN_READWRITE, connected);

let sql: string = `CREATE TABLE IF NOT EXISTS enemies(
  enemy_id INTEGER PRIMARY KEY,
  enemy_name TEXT NOT NULL,
  enemy_reason TEXT NOT NULL
)`;

db.run(sql, [], (err: Error | null) => {
  if (err) {
    console.log('error creating enemies table');
    return;
  }
  console.log('CREATED TABLE');
});

export { db };
