import { and, eq } from 'drizzle-orm';
import { NavigationData, NavigationRequest } from 'src/types.js';
import db from '../../db/db.js';
import { journeys, locations, routes } from '../../db/schema.js';
import { generateQRCode, generateVerificationToken } from '../utils/qrUtils.js';
import MonkeyService from './monkeyService.js';

const JourneyService = {
  createQRCode: async (request: NavigationRequest): Promise<NavigationData> => {
    const { monkeyId, destinationLocationId, journeyId } = request;
    const monkeyInfo = await MonkeyService.getMonkeyById(monkeyId);
    const destination = await db
      .select()
      .from(locations)
      .where(eq(locations.id, destinationLocationId));
    if (!monkeyInfo || !destination[0]) {
      throw new Error(
        `Monkey with ID ${request.monkeyId} or destination ${destinationLocationId} not found`
      );
    }
    const verificationToken = generateVerificationToken();
    const qrDataObject = {
      token: verificationToken,
      destinationId: destination[0].id,
      journeyId: journeyId,
    };
    const qrCodeImage = await generateQRCode(qrDataObject);
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
          eq(routes.destinationLocationId, destination[0].id)
        )
      );
    if (!route) {
      throw new Error(
        `Route information ${monkeyInfo.location.name} - ${destinationLocationId} not found`
      );
    }
    await db
      .update(journeys)
      .set({
        requestedDestinationId: destination[0].id,
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
    journeyId: number,
    monkeyId: number
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
        return false;
      }
      if (journey.journey.id !== journeyId) {
        await db.delete(journeys).where(eq(journeys.id, journeyId));
      }
      if (journey.journey.qrScannedAt) {
        return false;
      }
      const scanningMonkeyInfo = await MonkeyService.getMonkeyById(monkeyId);
      if (
        (scanningMonkeyInfo && scanningMonkeyInfo.location.id !== locationId) ||
        locationId !== journey.route.destinationLocationId
      ) {
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
      return false;
    }
  },

  recordNewJourney: async (locationId: number): Promise<number> => {
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
};

export default JourneyService;
