import { and, eq } from 'drizzle-orm';
import db from '../../db/db.js';
import { journeys, locations, routes } from '../../db/schema.js';
import { NotFoundError, SemanticError } from '../errors.js';
import { NavigationData, NavigationRequest } from '../types.js';
import { generateQRCode, generateVerificationToken } from '../utils/qrUtils.js';
import monkeyService from './monkeyService.js';

const journeyService = {
  createQRCode: async (request: NavigationRequest): Promise<NavigationData> => {
    const { monkeyId, destinationLocationId, journeyId } = request;

    const monkeyInfo = await monkeyService.getMonkeyById(monkeyId);

    const [destination] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, destinationLocationId));

    if (!destination) {
      throw new NotFoundError(
        `Destination location ${destinationLocationId} not found`
      );
    }

    const [journey] = await db
      .select()
      .from(journeys)
      .where(eq(journeys.id, journeyId));

    if (!journey) {
      throw new NotFoundError(`Journey with ID ${journeyId} not found`);
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
      throw new NotFoundError(
        `Route from ${monkeyInfo.location.name} to destination ${destinationLocationId} not found`
      );
    }

    const verificationToken = generateVerificationToken();
    const qrDataObject = {
      token: verificationToken,
      destinationId: destination.id,
      journeyId: journeyId,
    };
    const qrCodeImage = await generateQRCode(qrDataObject);

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
    journeyId: number,
    monkeyId: number
  ): Promise<boolean> => {
    const [journey] = await db
      .select({
        journey: journeys,
        route: routes,
      })
      .from(journeys)
      .innerJoin(routes, eq(journeys.routeId, routes.id))
      .where(eq(journeys.qrToken, token));

    if (!journey) {
      throw new NotFoundError(`Journey with token ${token} not found`);
    }

    if (journey.journey.id !== journeyId) {
      await db.delete(journeys).where(eq(journeys.id, journeyId));
      console.log(
        `Journey ID mismatch - journey deleted: ${journey.journey.id}`
      );
      return false;
    }

    if (journey.journey.qrScannedAt) {
      const error = new SemanticError(
        `Journey ${journey.journey.id} has already been scanned`
      );
      throw error;
    }

    const scanningMonkeyInfo = await monkeyService.getMonkeyById(monkeyId);
    if (
      (scanningMonkeyInfo && scanningMonkeyInfo.location.id !== locationId) ||
      locationId !== journey.route.destinationLocationId
    ) {
      throw new SemanticError(
        'Monkey location does not match scan location. Patient is at wrong destination.'
      );
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

export default journeyService;
