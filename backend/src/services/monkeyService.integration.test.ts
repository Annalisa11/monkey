import { eq } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';
import db from '../../db/db.js';
import {
  events,
  journeys,
  locations,
  monkeys,
  routes,
} from '../../db/schema.js';
import { NotFoundError } from '../errors.js';
import eventService from './eventService.js';
import journeyService from './journeyService.js';
import locationService from './locationService.js';
import monkeyService from './monkeyService.js';
import routeService from './routeService.js';

// Set test environment BEFORE importing db
process.env.NODE_ENV = 'test';

describe('MonkeyService Integration Tests', () => {
  beforeEach(async () => {
    // Clear and seed test data
    // Clear all tables in correct order (respecting foreign keys)
    await db.delete(events);
    await db.delete(journeys);
    await db.delete(routes);
    await db.delete(monkeys);
    await db.delete(locations);
  });

  describe('Location CRUD Operations', () => {
    it('should create a new location', async () => {
      const locationData = { name: 'Test Location' };

      await locationService.createLocation(locationData);

      const locationsList = await locationService.getAllLocations();
      expect(locationsList).toHaveLength(1);
      expect(locationsList[0].name).toBe('Test Location');
    });

    it('should get location by ID', async () => {
      // Setup
      await db.insert(locations).values({ id: 1, name: 'Test Location' });

      const location = await locationService.getLocationById(1);

      expect(location).toBeDefined();
      expect(location?.name).toBe('Test Location');
    });

    it('should update a location', async () => {
      // Setup
      await db.insert(locations).values({ id: 1, name: 'Old Name' });

      await locationService.updateLocation(1, { name: 'New Name' });

      const location = await locationService.getLocationById(1);
      expect(location?.name).toBe('New Name');
    });

    it('should delete a location', async () => {
      // Setup
      await db.insert(locations).values({ id: 1, name: 'Test Location' });

      await locationService.deleteLocation(1);

      await expect(locationService.getLocationById(1)).rejects.toBeInstanceOf(
        NotFoundError
      );
    });

    it('should throw NotFoundError for non-existent location', async () => {
      await expect(locationService.getLocationById(999)).rejects.toBeInstanceOf(
        NotFoundError
      );
    });
  });

  const locationA = { id: 1, name: 'Location A' };
  const locationB = { id: 2, name: 'Location B' };

  describe('Monkey CRUD Operations', () => {
    beforeEach(async () => {
      // Setup required location for monkeys
      await db.insert(locations).values([
        { id: 1, name: 'Location A' },
        { id: 2, name: 'Location B' },
      ]);
    });

    it('should create a new monkey', async () => {
      const monkeyData = {
        name: 'Test Monkey One',
        isActive: true,
        location: locationA,
      };

      await monkeyService.createMonkey(monkeyData);

      const monkeysList = await monkeyService.getAllMonkeys();
      expect(monkeysList).toHaveLength(1);
      expect(monkeysList[0].name).toBe('Test Monkey One');
      expect(monkeysList[0].isActive).toBe(true);
      expect(monkeysList[0].location.name).toBe('Location A');
    });

    it('should get monkey by ID', async () => {
      // Setup
      await db.insert(monkeys).values({
        monkeyId: 2,
        name: 'Test Monkey Two',
        isActive: true,
        locationId: 1,
      });

      const monkey = await monkeyService.getMonkeyById(2);

      expect(monkey).toBeDefined();
      expect(monkey?.name).toBe('Test Monkey Two');
      expect(monkey?.location.name).toBe('Location A');
    });

    it('should update a monkey', async () => {
      // Setup
      await db.insert(monkeys).values({
        monkeyId: 1,
        name: 'Old Name',
        locationId: 1,
        isActive: false,
      });

      const updateData = {
        name: 'New Name',
        isActive: true,
        location: locationB,
      };

      await monkeyService.updateMonkey(1, updateData);

      const monkey = await monkeyService.getMonkeyById(1);
      expect(monkey?.name).toBe('New Name');
      expect(monkey?.isActive).toBe(true);
      expect(monkey?.location.name).toBe('Location B');
    });

    it('should delete a monkey', async () => {
      // Setup
      await db.insert(monkeys).values({
        monkeyId: 1,
        name: 'Test Monkey',
        locationId: 1,
        isActive: true,
      });

      await monkeyService.deleteMonkey(1);

      await expect(monkeyService.getMonkeyById(1)).rejects.toBeInstanceOf(
        NotFoundError
      );
    });
  });

  describe('Route CRUD Operations', () => {
    beforeEach(async () => {
      // Setup required locations for routes
      await db.insert(locations).values([
        { id: 1, name: 'Location A' },
        { id: 2, name: 'Location B' },
        { id: 3, name: 'Location C' },
      ]);
    });

    it('should create a new route', async () => {
      const routeData = {
        id: 1,
        sourceLocation: locationA,
        destinationLocation: locationB,
        description: 'Route from A to B',
        isAccessible: true,
      };

      await routeService.createRoute(routeData);

      const routesList = await routeService.getRoutesByLocation(1);
      expect(routesList).toHaveLength(1);
      expect(routesList[0].description).toBe('Route from A to B');
      expect(routesList[0].isAccessible).toBe(true);
    });

    it('should get routes by source location', async () => {
      // Setup
      await db.insert(routes).values([
        {
          sourceLocationId: 1,
          destinationLocationId: 2,
          description: 'Route A to B',
          isAccessible: true,
        },
        {
          sourceLocationId: 1,
          destinationLocationId: 3,
          description: 'Route A to C',
          isAccessible: false,
        },
        {
          sourceLocationId: 2,
          destinationLocationId: 3,
          description: 'Route B to C',
          isAccessible: true,
        },
      ]);

      const routesFromA = await routeService.getRoutesByLocation(1);

      expect(routesFromA).toHaveLength(2);
      expect(routesFromA[0].sourceLocation.name).toBe('Location A');
      expect(routesFromA[0].destinationLocation.name).toBe('Location B');
      expect(routesFromA[1].destinationLocation.name).toBe('Location C');
    });
  });

  describe('Journey Operations', () => {
    beforeEach(async () => {
      // Setup required data
      await db.insert(locations).values([
        { id: 1, name: 'Location A' },
        { id: 2, name: 'Location B' },
      ]);

      await db.insert(monkeys).values([
        {
          monkeyId: 1,
          name: 'Test Monkey',
          locationId: 1,
          isActive: true,
        },
        {
          monkeyId: 2,
          name: 'Second Test Monkey',
          locationId: 2,
          isActive: true,
        },
      ]);

      await db.insert(routes).values({
        sourceLocationId: 1,
        destinationLocationId: 2,
        description: 'Test Route',
        isAccessible: true,
      });
    });

    it('should record a new journey', async () => {
      const journeyId = await journeyService.recordNewJourney(1);

      expect(journeyId).toBeDefined();
      expect(typeof journeyId).toBe('number');

      // Verify journey was created
      const [journey] = await db
        .select()
        .from(journeys)
        .where(eq(journeys.id, journeyId));
      expect(journey).toBeDefined();
      expect(journey.status).toBe('started');
      expect(journey.startLocationId).toBe(1);
    });

    it('should create QR code for navigation request', async () => {
      const journeyId = await journeyService.recordNewJourney(1);

      const navigationData = await journeyService.createQRCode({
        monkeyId: 1,
        destinationLocationId: 2,
        journeyId,
      });

      expect(navigationData.qrCode.destinationId).toBe(2);
      expect(navigationData.qrCode.token).toBeDefined();
      expect(navigationData.qrCode.journeyId).toBe(journeyId);
      expect(navigationData.routeDescription).toBe('Test Route');

      // Verify journey was updated
      const [journey] = await db
        .select()
        .from(journeys)
        .where(eq(journeys.id, journeyId));
      expect(journey.status).toBe('qr_generated');
      expect(journey.qrToken).toBe(navigationData.qrCode.token);
    });

    it('should verify destination successfully', async () => {
      // Setup complete journey flow
      const journeyId = await journeyService.recordNewJourney(1);
      const navigationData = await journeyService.createQRCode({
        monkeyId: 1,
        destinationLocationId: 2,
        journeyId,
      });

      const isValid = await journeyService.verifyDestination(
        navigationData.qrCode.token,
        2, // location id
        journeyId,
        2 // monkey id
      );

      expect(isValid).toBe(true);

      // Verify journey was completed
      const [journey] = await db
        .select()
        .from(journeys)
        .where(eq(journeys.id, journeyId));
      expect(journey.status).toBe('completed');
      expect(journey.qrScannedAt).toBeDefined();
    });
  });

  describe('Event Recording', () => {
    beforeEach(async () => {
      // Setup required data
      await db.insert(locations).values({ id: 1, name: 'Location A' });
      await db.insert(monkeys).values({
        monkeyId: 1,
        name: 'Test Monkey',
        locationId: 1,
        isActive: true,
      });
    });

    it('should record button press event', async () => {
      const journeyId = await journeyService.recordNewJourney(1);

      await eventService.recordEvent({
        eventType: 'button_press',
        journeyId,
        locationId: 1,
        monkeyId: 1,
        action: 'button_press',
      });

      const allEvents = await db.select().from(events);
      expect(allEvents).toHaveLength(1);
      expect(allEvents[0].eventType).toBe('button_press');
      expect(allEvents[0].journeyId).toBe(journeyId);
      expect(allEvents[0].locationId).toBe(1);

      const metadata = JSON.parse(allEvents[0].metadata!);
      expect(metadata.monkeyId).toBe(1);
      expect(metadata.action).toBe('button_press');
    });

    it('should record banana return event', async () => {
      await eventService.recordEvent({
        eventType: 'banana_return',
        locationId: 1,
        monkeyId: 1,
        action: 'banana_return',
      });

      const allEvents = await db.select().from(events);
      expect(allEvents).toHaveLength(1);
      expect(allEvents[0].eventType).toBe('banana_return');
      expect(allEvents[0].locationId).toBe(1);
      expect(allEvents[0].journeyId).toBeNull();

      const metadata = JSON.parse(allEvents[0].metadata!);
      expect(metadata.monkeyId).toBe(1);
      expect(metadata.action).toBe('banana_return');
    });
  });

  describe('Error Handling', () => {
    it('should throw error for non-existent monkey in QR code creation', async () => {
      await db.insert(locations).values({ id: 1, name: 'Location A' });
      const journeyId = await journeyService.recordNewJourney(1);

      await expect(
        journeyService.createQRCode({
          monkeyId: 999, // Non-existent monkey
          destinationLocationId: 1,
          journeyId,
        })
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('should throw error for non-existent location', async () => {
      await expect(
        locationService.getLocationById(9999)
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('should throw error for invalid destination verification', async () => {
      await expect(
        journeyService.verifyDestination('invalid-token', 1, 1, 1)
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
