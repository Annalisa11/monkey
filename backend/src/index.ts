const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const { db } = require('../db/db');

dotenv.config();

if (!process.env.PORT) {
  console.log(`No port value specified...`);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.listen(PORT, (): void => {
  console.log(`Server is listening on port ${PORT}`);
});

interface Enemy {
  enemy_id: number;
  enemy_name: string;
  enemy_reason: string;
}

db.serialize((): void => {
  db.all('SELECT * FROM enemies', [], (err: Error | null, rows: Enemy[]) => {
    if (err) {
      console.error('Could not query enemies:', err.message);
    } else {
      console.log('Enemies in DB:', rows);
    }
  });
});
