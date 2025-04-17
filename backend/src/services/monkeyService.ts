import {
  monkeys,
  locations,
  routes,
  navigationQrCodes,
} from '../../db/schema.js';
import db from '../../db/db.js';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { eq, and } from 'drizzle-orm';
import {
  Location,
  Monkey,
  NavigationData,
  NavigationRequest,
} from '../types.js';

interface MonkeyService {
  getAllMonkeys(): Promise<Monkey[]>;
  getNavigationInformation(request: NavigationRequest): Promise<NavigationData>;
  verifyDestination(token: string, locationId: number): Promise<boolean>;
  getAllLocations(): Promise<Location[]>;
  getLocationById(id: number): Promise<Location | null>;
  getLocationByName(locationName: string): Promise<Location | null>;
  getMonkeyById(monkeyId: number): Promise<Monkey | null>;
  getLocationIdByName(name: string): Promise<number>;
}

const monkeyWithLocationSelect = {
  monkeyId: monkeys.monkeyId,
  name: monkeys.name,
  isActive: monkeys.isActive,
  address: monkeys.address,
  location: {
    id: locations.id,
    name: locations.name,
  },
};

const monkeyService: MonkeyService = {
  getAllMonkeys: async (): Promise<Monkey[]> => {
    return await db
      .select(monkeyWithLocationSelect)
      .from(monkeys)
      .innerJoin(locations, eq(monkeys.locationId, locations.id));
  },

  getNavigationInformation: async (
    request: NavigationRequest
  ): Promise<NavigationData> => {
    const { currentLocation, destinationLocationName } = request;

    const destination = await monkeyService.getLocationByName(
      destinationLocationName
    );
    console.log('destinations: ', currentLocation, destinationLocationName);

    if (!destination || !currentLocation) {
      throw new Error(
        `Destination location ${destinationLocationName} or current location ${currentLocation} not found`
      );
    }

    const verificationToken = crypto.randomBytes(16).toString('hex');

    const [route] = await db
      .select()
      .from(routes)
      .where(
        and(
          eq(routes.sourceLocationId, currentLocation.id),
          eq(routes.destinationLocationId, destination.id)
        )
      );

    if (!route) {
      throw new Error(
        `Route information ${currentLocation} - ${destinationLocationName} not found`
      );
    }

    await db.insert(navigationQrCodes).values({
      token: verificationToken,
      routeId: route.id,
      createdAt: Date.now(),
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
      routeDescription: route.description,
    };
  },

  verifyDestination: async (
    token: string,
    locationId: number
  ): Promise<boolean> => {
    try {
      const qrCodeResults = await db
        .select({
          qrCode: navigationQrCodes,
          route: routes,
        })
        .from(navigationQrCodes)
        .innerJoin(routes, eq(navigationQrCodes.routeId, routes.id))
        .where(eq(navigationQrCodes.token, token));

      if (qrCodeResults.length === 0) {
        // Route doesn't exist (token is not right or patient scanned QR code at wrong destination)
        return false;
      }

      const qrCodeResult = qrCodeResults[0];

      if (qrCodeResult.qrCode.scanned) {
        // The QR code has already been scanned before
        return false;
      }

      if (qrCodeResult.route.destinationLocationId !== locationId) {
        // Patient is at the wrong destination
        return false;
      }

      await db
        .update(navigationQrCodes)
        .set({ scanned: 1 })
        .where(eq(navigationQrCodes.id, qrCodeResult.qrCode.id));

      return true;
    } catch (error) {
      console.error('Error verifying destination:', error);
      return false;
    }
  },

  getAllLocations: async (): Promise<Location[]> => {
    return await db.select().from(locations);
  },

  getLocationById: async (id: number): Promise<Location | null> => {
    const [location] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, id));
    return location || null;
  },

  getLocationByName: async (locationName: string): Promise<Location | null> => {
    const [location] = await db
      .select()
      .from(locations)
      .where(eq(locations.name, locationName));
    return location || null;
  },

  getLocationIdByName: async (name: string): Promise<number> => {
    const [location] = await db
      .select()
      .from(locations)
      .where(eq(locations.name, name));

    if (!location) {
      throw new Error(`Location ${name} not found`);
    }

    return location.id;
  },

  getMonkeyById: async (monkeyId: number): Promise<Monkey | null> => {
    const [monkey] = await db
      .select(monkeyWithLocationSelect)
      .from(monkeys)
      .innerJoin(locations, eq(monkeys.locationId, locations.id))
      .where(eq(monkeys.monkeyId, monkeyId));

    return monkey || null;
  },
};

export default monkeyService;
