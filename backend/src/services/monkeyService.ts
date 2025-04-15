import { Monkey } from '../../db/schema.js';
import db from '../../db/db.js';
import QRCode from 'qrcode';
import crypto from 'crypto';

interface Location {
  id: number;
  name: string;
}

interface Route {
  id: number;
  source_location_name: string;
  destination_location_name: string;
  description: string;
  is_accessible: boolean;
}

interface NavigationData {
  routeDescription: string;
  qrCode: string;
}

interface NavigationRequest {
  currentLocation: string;
  destinationLocation: string;
  monkeyId: number;
}

interface MonkeyService {
  getAllMonkeys(): Promise<Monkey[]>;
  getNavigationInformation(request: NavigationRequest): Promise<NavigationData>;
  verifyDestination(token: string, locationId: number): Promise<boolean>;
  getAllLocations(): Promise<Location[]>;
  getLocationById(id: number): Promise<Location | null>;
  getMonkeyById(monkeyId: number): Promise<Monkey | null>;
}

function getLocationByName(locationName: string): Promise<Location | null> {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM locations WHERE name = ?',
      [locationName],
      (err: Error | null, row: Location | undefined) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row || null);
      }
    );
  });
}

const monkeyService: MonkeyService = {
  getAllMonkeys: async (): Promise<Monkey[]> => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM monkeys',
        [],
        (err: Error | null, rows: Monkey[]) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        }
      );
    });
  },

  getNavigationInformation: async (
    request: NavigationRequest
  ): Promise<NavigationData> => {
    try {
      const { currentLocation, destinationLocation } = request;

      const destination = await getLocationByName(destinationLocation);
      if (!destination) {
        throw new Error(
          `Destination location ${destinationLocation} not found`
        );
      }

      const verificationToken = crypto.randomBytes(16).toString('hex');

      const { id: routeId, description } = await new Promise<Route>(
        (resolve, reject) => {
          db.get(
            'SELECT * FROM routes WHERE source_location_name = ? AND destination_location_name = ?',
            [currentLocation, destinationLocation],
            (err: Error | null, row: Route | undefined) => {
              if (err) {
                reject(err);
                return;
              }

              if (row) {
                console.table(row);
                console.log(row.description);
                resolve(row);
              } else {
                throw new Error(
                  `Route information ${currentLocation} - ${destinationLocation} not found`
                );
              }
            }
          );
        }
      );

      // Store the token with the destination in the database for verification
      await new Promise<void>((resolve, reject) => {
        db.run(
          'INSERT INTO navigation_qr_codes (token, route_id, created_at) VALUES (?, ?, ?)',
          [verificationToken, routeId, Date.now()],
          (err: Error | null) => {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          }
        );
      });

      const qrData = JSON.stringify({
        token: verificationToken,
        destinationId: destination.id,
      });

      console.log('TOKEN: ', verificationToken);
      console.log('DESTINATION ID: ', destination.id);
      const qrCodeImage = await QRCode.toDataURL(qrData);
      console.log(qrCodeImage);

      return {
        qrCode: qrCodeImage,
        routeDescription: description,
      };
    } catch (error) {
      throw error;
    }
  },

  verifyDestination: (token: string, locationId: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT nqc.id, r.destination_location_name, nqc.scanned 
         FROM navigation_qr_codes nqc
         JOIN routes r ON nqc.route_id = r.id
         JOIN locations l ON r.destination_location_name = l.name
         WHERE nqc.token = ? AND l.id = ?`,
        [token, locationId],
        (
          err: Error | null,
          row: { id: number; scanned: boolean } | undefined
        ) => {
          if (err) {
            reject(err);
            return;
          }

          if (!row) {
            // route doesn't exist (token is not right or patient scanned qr code at wrong destination)
            resolve(false);
            return;
          }

          if (row.scanned) {
            // the qr code has been already scanned before
            reject(false);
          }

          if (row.id === locationId) {
            // patient is at right destination, mission success
            resolve(true);
            return;
          }

          // Mark as scanned
          db.run(
            'UPDATE navigation_qr_codes SET scanned = ? WHERE id = ?',
            [1, row.id],
            (updateErr: Error | null) => {
              if (updateErr) {
                reject(updateErr);
                return;
              }
              resolve(true);
            }
          );
        }
      );
    });
  },

  getAllLocations: (): Promise<Location[]> => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM locations',
        [],
        (err: Error | null, rows: Location[]) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        }
      );
    });
  },

  getLocationById: (id: number): Promise<Location | null> => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM locations WHERE id = ?',
        [id],
        (err: Error | null, row: Location | undefined) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row || null);
        }
      );
    });
  },
  getMonkeyById: async (monkeyId) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM monkeys WHERE monkey_id = ?`,
        [monkeyId],
        (err: Error | null, row: Monkey) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        }
      );
    });
  },
};

export default monkeyService;
