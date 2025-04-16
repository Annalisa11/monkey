import db from './db.js';

type SqlParam = string | number | boolean | null;
type SqlParams = SqlParam[];

export const dbRun = (sql: string, params: SqlParams = []) =>
  new Promise<void>((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

export const dbGet = <T = any>(sql: string, params: SqlParams = []) =>
  new Promise<T>((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T);
    });
  });

export const dbAll = <T = any>(sql: string, params: SqlParams = []) =>
  new Promise<T[]>((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
