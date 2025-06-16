import crypto from 'crypto';
import { and, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import QRCode from 'qrcode';
import { NavigationData, NavigationRequest } from 'src/types.js';
import {
  Location,
  LocationForm,
  Monkey,
  MonkeyForm,
  Route,
  RouteForm,
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
  createQRCode(request: NavigationRequest): Promise<NavigationData>;
  verifyDestination(
    token: string,
    locationId: number,
    journeyId: number
  ): Promise<boolean>;
  getAllLocations(): Promise<Location[]>;
  getLocationById(id: number): Promise<Location | null>;
  getLocationByName(locationName: string): Promise<Location | null>;
  getMonkeyById(monkeyId: number): Promise<Monkey | null>;
  createMonkey(newMonkey: MonkeyForm): Promise<void>;
  deleteMonkey(id: number): Promise<void>;
  updateMonkey(id: number, data: MonkeyForm): Promise<void>;
  getLocationIdByName(name: string): Promise<number>;
  createLocation(newLocation: LocationForm): Promise<void>;
  deleteLocation(id: number): Promise<void>;
  updateLocation(id: number, data: LocationForm): Promise<void>;
  getLocations(): Promise<Location[]>;
  createRoute(newRoute: RouteForm): Promise<void>;
  deleteRoute(
    sourceLocationId: number,
    destinationLocationId: number
  ): Promise<void>;
  updateRoute(data: Route): Promise<void>;
  getRoutesByLocation(sourceLocationId: number): Promise<Route[]>;
  recordNewJourney(locationId: number): Promise<number>;
  recordButtonPressEvent(monkeyId: number, journeyId: number): Promise<void>;
  recordBananaReturnEvent(monkeyId: number): Promise<void>;
}

const monkeyWithLocationSelect = {
  id: monkeys.monkeyId,
  name: monkeys.name,
  isActive: monkeys.isActive,
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

  updateMonkey: async (id: number, data: MonkeyForm): Promise<void> => {
    await db
      .update(monkeys)
      .set({
        name: data.name,
        isActive: data.isActive,
        locationId: data.location.id,
      })
      .where(eq(monkeys.monkeyId, id));
  },

  createQRCode: async (request: NavigationRequest): Promise<NavigationData> => {
    const { monkeyId, destinationLocationName, journeyId } = request;
    const monkeyInfo = await monkeyService.getMonkeyById(monkeyId);
    const destination = await monkeyService.getLocationByName(
      destinationLocationName
    );
    if (!monkeyInfo || !destination) {
      throw new Error(
        `Monkey with ID ${request.monkeyId} or destination ${destination} not found`
      );
    }

    // generate QR code
    const verificationToken = crypto.randomBytes(16).toString('hex');

    const qrDataObject = {
      token: verificationToken,
      destinationId: destination.id,
      journeyId: journeyId,
    };

    const qrData = JSON.stringify(qrDataObject);

    console.log('TOKEN: ', verificationToken);
    console.log('DESTINATION ID: ', destination.id);
    const qrCodeImage = await QRCode.toString(qrData, {
      type: 'svg',
    });
    console.log(qrCodeImage);

    // get journey and route information
    const [journey] = await db
      .select()
      .from(journeys)
      .where(eq(journeys.id, journeyId));

    if (!journey) {
      throw new Error(`Journey with ID ${journeyId} not found`);
    }

    const [route] = await db
      .select()
      .from(routes)
      .where(
        and(
          eq(routes.sourceLocationId, monkeyInfo.location.id),
          eq(routes.destinationLocationId, destination.id)
        )
      );

    if (!route) {
      throw new Error(
        `Route information ${monkeyInfo.location.name} - ${destinationLocationName} not found`
      );
    }

    // update journey information with qr code stuff
    console.log('Updating journey with QR code data');
    await db
      .update(journeys)
      .set({
        requestedDestinationId: destination.id,
        routeId: route.id,
        qrGeneratedAt: new Date(),
        status: 'qr_generated',
        qrToken: verificationToken,
      })
      .where(eq(journeys.id, journeyId));

    return {
      qrCode: qrDataObject,
      routeDescription: route.description,
    };
  },

  verifyDestination: async (
    token: string,
    locationId: number,
    journeyId: number
  ): Promise<boolean> => {
    try {
      // TODO: why do I get journey {journey: { id: 1, ... }} ? Fix this
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
        console.log('Journey not found');
        return false;
      }

      if (journey.journey.id !== journeyId) {
        console.log(
          'Journey ID does not match the one in the QR code. Deleting the new journey.'
        );
        // if journey id doesn't match the journey id of the qr code, then it's an ongoing journey
        // and the new journey created on button press should be deleted
        await db.delete(journeys).where(eq(journeys.id, journeyId));
      }

      if (journey.journey.qrScannedAt) {
        console.log('QR code already scanned');
        // The QR code has already been scanned before
        return false;
      }

      if (journey.route.destinationLocationId !== locationId) {
        console.log(
          'Patient is at the wrong destination. Expected:',
          journey.route.destinationLocationId
        );
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

      return true;
    } catch (error) {
      console.error('Error verifying destination:', error);
      return false;
    }
  },

  recordNewJourney: async (locationId: number) => {
    const [journeyData] = await db
      .insert(journeys)
      .values({
        startTime: new Date(),
        status: 'started',
        startLocationId: locationId,
        requestedDestinationId: null,
        routeId: null,
        qrToken: null,
      })
      .returning();

    return journeyData.id;
  },

  recordButtonPressEvent: async (monkeyId: number, journeyId: number) => {
    console.log('Recording button press event for monkeyId:', monkeyId);
    const [monkey] = await db
      .select()
      .from(monkeys)
      .where(eq(monkeys.monkeyId, monkeyId));

    const metaInfo = {
      monkeyId: monkeyId,
      action: 'button_press',
    };

    await db.insert(events).values({
      eventType: 'button_press',
      journeyId: journeyId,
      locationId: monkey.locationId,
      timestamp: new Date(),
      metadata: JSON.stringify(metaInfo),
    });
  },

  recordBananaReturnEvent: async (monkeyId: number) => {
    console.log('Recording banana return event for monkeyId:', monkeyId);
    const [monkey] = await db
      .select()
      .from(monkeys)
      .where(eq(monkeys.monkeyId, monkeyId));

    const metaInfo = {
      monkeyId: monkeyId,
      action: 'banana_return',
    };

    await db.insert(events).values({
      eventType: 'banana_return',
      locationId: monkey.locationId,
      timestamp: new Date(),
      metadata: JSON.stringify(metaInfo),
    });
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
  createMonkey: async (newMonkey: MonkeyForm): Promise<void> => {
    await db.insert(monkeys).values({
      name: newMonkey.name,
      isActive: newMonkey.isActive,
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
        id: routes.id,
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
      .where(eq(routes.id, data.id));
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
