import { Monkey } from '../../db/schema.js';

import db from '../../db/db.js';

interface MonkeyService {
  getAllMonkeys(): Promise<Monkey[]>;
}

const monkeyService: MonkeyService = {
  getAllMonkeys: (): Promise<Monkey[]> => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM monkeys', [], (err: Error, rows: Monkey[]) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  },

  // Get monkey by ID

  // Create a new monkey

  // ...
};

export default monkeyService;
