import db from '../../db/db.js';

interface ButtonPressData {
  monkeyId: number;
  timestamp: Date;
  location: string;
}

interface EventService {
  recordButtonPressData(data: ButtonPressData): Promise<number>;
  recordJourneyCompletion(): Promise<boolean>;
}

const eventService: EventService = {
  recordButtonPressData: (data: ButtonPressData): Promise<number> => {
    return new Promise((resolve, reject) => {
      const { monkeyId, timestamp, location } = data;
      const date = new Date(timestamp);
      const sql =
        'INSERT INTO button_press_events (monkey_id, timestamp, location) VALUES (?, ?, ?)';
      const params = [monkeyId, date.toISOString(), location];

      db.run(sql, params, function (err: Error | null) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  },

  recordJourneyCompletion: (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const timestamp = new Date().toISOString();
      db.run(
        `INSERT INTO journey_completions (timestamp) VALUES (?)`,
        [timestamp],
        (err: Error | null) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(true);
        }
      );
    });
  },
};

export default eventService;
