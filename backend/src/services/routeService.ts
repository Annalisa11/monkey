import { and, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { Route, RouteForm } from 'validation';
import db from '../../db/db.js';
import { locations, routes } from '../../db/schema.js';

const RouteService = {
  getRoutesByLocation: async (sourceLocationId: number): Promise<Route[]> => {
    const destinationLocations = alias(locations, 'destinationLocations');
    return await db
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
  },

  createRoute: async (newRoute: RouteForm): Promise<void> => {
    await db.insert(routes).values({
      sourceLocationId: newRoute.sourceLocation.id,
      destinationLocationId: newRoute.destinationLocation.id,
      description: newRoute.description,
      isAccessible: newRoute.isAccessible,
    });
  },

  updateRoute: async (data: Route): Promise<void> => {
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

  deleteRoute: async (
    sourceLocationId: number,
    destinationLocationId: number
  ): Promise<void> => {
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

export default RouteService;
