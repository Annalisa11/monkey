import crypto from 'crypto';
import { and, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import QRCode from 'qrcode';
import { NavigationData, NavigationRequest } from 'src/types.js';
import {
  CreateMonkey,
  Location,
  LocationForm,
  Monkey,
  Route,
} from 'validation';
import db from '../../db/db.js';
import {
  events,
  journeys,
  locations,
  monkeys,
  routes,
} from '../../db/schema.js';

interface MonkeyService {
  getAllMonkeys(): Promise<Monkey[]>;
  getNavigationInformation(request: NavigationRequest): Promise<NavigationData>;
  verifyDestination(token: string, locationId: number): Promise<boolean>;
  getAllLocations(): Promise<Location[]>;
  getLocationById(id: number): Promise<Location | null>;
  getLocationByName(locationName: string): Promise<Location | null>;
  getMonkeyById(monkeyId: number): Promise<Monkey | null>;
  createMonkey(newMonkey: CreateMonkey): Promise<void>;
  deleteMonkey(id: number): Promise<void>;
  updateMonkey(id: number, data: CreateMonkey): Promise<void>;
  getLocationIdByName(name: string): Promise<number>;
  createLocation(newLocation: LocationForm): Promise<void>;
  deleteLocation(id: number): Promise<void>;
  updateLocation(id: number, data: LocationForm): Promise<void>;
  getLocations(): Promise<Location[]>;
  createRoute(newRoute: Route): Promise<void>;
  deleteRoute(
    sourceLocationId: number,
    destinationLocationId: number
  ): Promise<void>;
  updateRoute(data: Route): Promise<void>;
  getRoutesByLocation(sourceLocationId: number): Promise<Route[]>;
}

const monkeyWithLocationSelect = {
  id: monkeys.monkeyId,
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

  updateMonkey: async (id: number, data: CreateMonkey): Promise<void> => {
    await db
      .update(monkeys)
      .set({
        name: data.name,
        isActive: data.isActive,
        address: data.address,
        locationId: data.location.id,
      })
      .where(eq(monkeys.monkeyId, id));
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

    const now = new Date();

    await db.insert(journeys).values({
      startTime: now,
      status: 'qr_generated',
      startLocationId: currentLocation.id,
      requestedDestinationId: destination.id,
      routeId: route.id,
      qrToken: verificationToken,
      qrGeneratedAt: now,
    });

    await db.insert(events).values({
      eventType: 'qr_generated',
      locationId: currentLocation.id,
      timestamp: now,
      metadata: JSON.stringify({
        destinationId: destination.id,
        token: verificationToken,
      }),
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
      const [journey] = await db
        .select({
          journey: journeys,
          route: routes,
        })
        .from(journeys)
        .innerJoin(routes, eq(journeys.routeId, routes.id))
        .where(eq(journeys.qrToken, token));

      if (!journey) {
        // Journey doesn't exist (token is not right)
        return false;
      }

      if (journey.journey.qrScannedAt) {
        // The QR code has already been scanned before
        return false;
      }

      if (journey.route.destinationLocationId !== locationId) {
        // Patient is at the wrong destination
        return false;
      }

      const now = new Date();

      await db
        .update(journeys)
        .set({
          qrScannedAt: now,
          endTime: now,
          status: 'completed',
        })
        .where(eq(journeys.qrToken, token));

      const startTime = new Date(journey.journey.startTime);
      const duration = now.getTime() - startTime.getTime();

      await db.insert(events).values({
        journeyId: journey.journey.id,
        eventType: 'journey_completed',
        locationId: locationId,
        timestamp: now,
        metadata: JSON.stringify({
          startLocationId: journey.journey.startLocationId,
          duration: duration,
        }),
      });

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
  createMonkey: async (newMonkey: CreateMonkey): Promise<void> => {
    await db.insert(monkeys).values({
      name: newMonkey.name,
      isActive: newMonkey.isActive,
      address: newMonkey.address,
      locationId: newMonkey.location.id,
    });
  },

  deleteMonkey: async (id: number): Promise<void> => {
    await db.delete(monkeys).where(eq(monkeys.monkeyId, id));
  },

  getMonkeyById: async (monkeyId: number): Promise<Monkey | null> => {
    const [monkey] = await db
      .select(monkeyWithLocationSelect)
      .from(monkeys)
      .innerJoin(locations, eq(monkeys.locationId, locations.id))
      .where(eq(monkeys.monkeyId, monkeyId));

    return monkey || null;
  },

  getLocations: async (): Promise<Location[]> => {
    return await db.select().from(locations);
  },

  updateLocation: async (id, data) => {
    await db
      .update(locations)
      .set({ name: data.name })
      .where(eq(locations.id, id));
  },

  createLocation: async (newLocation) => {
    await db
      .insert(locations)
      .values({
        name: newLocation.name,
      })
      .returning();
  },

  deleteLocation: async (id) => {
    await db.delete(locations).where(eq(locations.id, id));
  },

  getRoutesByLocation: async (sourceLocationId: number) => {
    const destinationLocations = alias(locations, 'destinationLocations');

    const result = await db
      .select({
        sourceLocation: {
          id: routes.sourceLocationId,
          name: locations.name,
        },
        destinationLocation: {
          id: routes.destinationLocationId,
          name: destinationLocations.name,
        },
        description: routes.description,
        isAccessible: routes.isAccessible,
      })
      .from(routes)
      .innerJoin(locations, eq(routes.sourceLocationId, locations.id))
      .innerJoin(
        destinationLocations,
        eq(routes.destinationLocationId, destinationLocations.id)
      )
      .where(eq(routes.sourceLocationId, sourceLocationId));

    return result;
  },

  updateRoute: async (data) => {
    await db
      .update(routes)
      .set({
        sourceLocationId: data.sourceLocation.id,
        destinationLocationId: data.destinationLocation.id,
        description: data.description,
        isAccessible: data.isAccessible,
      })
      .where(
        and(
          eq(routes.sourceLocationId, data.sourceLocation.id),
          eq(routes.destinationLocationId, data.destinationLocation.id)
        )
      );
  },

  createRoute: async (newRoute) => {
    await db.insert(routes).values({
      sourceLocationId: newRoute.sourceLocation.id,
      destinationLocationId: newRoute.destinationLocation.id,
      description: newRoute.description,
      isAccessible: newRoute.isAccessible,
    });
  },

  deleteRoute: async (sourceLocationId, destinationLocationId) => {
    await db
      .delete(routes)
      .where(
        and(
          eq(routes.sourceLocationId, sourceLocationId),
          eq(routes.destinationLocationId, destinationLocationId)
        )
      );
  },
};

export default monkeyService;
