import { and, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { Route, RouteForm } from 'validation';
import db from '../../db/db.js';
import { locations, routes } from '../../db/schema.js';
import { ConflictError, NotFoundError } from '../errors.js';

const routeService = {
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

  getRoute: async (
    sourceLocationId: number,
    destinationLocationId: number
  ): Promise<Route> => {
    const destinationLocations = alias(locations, 'destinationLocations');
    const [dbRoute] = await db
      .select({
        id: routes.id,
        description: routes.description,
        isAccessible: routes.isAccessible,
        sourceLocation: {
          id: routes.sourceLocationId,
          name: locations.name,
        },
        destinationLocation: {
          id: routes.destinationLocationId,
          name: destinationLocations.name,
        },
      })
      .from(routes)
      .innerJoin(locations, eq(routes.sourceLocationId, locations.id))
      .innerJoin(
        destinationLocations,
        eq(routes.destinationLocationId, destinationLocations.id)
      )
      .where(
        and(
          eq(routes.sourceLocationId, sourceLocationId),
          eq(routes.destinationLocationId, destinationLocationId)
        )
      );

    if (!dbRoute) throw new NotFoundError('Route not found');
    return dbRoute;
  },

  createRoute: async (newRoute: RouteForm): Promise<void> => {
    try {
      await db.insert(routes).values({
        sourceLocationId: newRoute.sourceLocation.id,
        destinationLocationId: newRoute.destinationLocation.id,
        description: newRoute.description,
        isAccessible: newRoute.isAccessible ?? null,
      });
    } catch (error: any) {
      if (error.code === '23505' || error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new ConflictError('Route already exists');
      }
      throw error;
    }
  },

  updateRoute: async (data: Route): Promise<void> => {
    const result = await db
      .update(routes)
      .set({
        description: data.description,
        isAccessible: data.isAccessible,
      })
      .where(eq(routes.id, data.id));

    if (result.changes === 0) {
      throw new NotFoundError('Route not found');
    }
  },

  deleteRoute: async (
    sourceLocationId: number,
    destinationLocationId: number
  ): Promise<void> => {
    const result = await db
      .delete(routes)
      .where(
        and(
          eq(routes.sourceLocationId, sourceLocationId),
          eq(routes.destinationLocationId, destinationLocationId)
        )
      );

    if (result.changes === 0) {
      throw new NotFoundError('Route not found');
    }
  },
};

export default routeService;
