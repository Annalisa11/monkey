import { Monkey } from '../../db/schema';

const { db } = require('../../db/db');

const getAllMonkeys = (): Promise<Monkey[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM monkeys', [], (err: Error, rows: Monkey[]) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};

// Get monkey by ID

// Create a new monkey

// ...

module.exports = { getAllMonkeys };
