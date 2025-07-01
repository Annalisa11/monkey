import { eq } from 'drizzle-orm';
import { Location, LocationForm } from 'validation';
import db from '../../db/db.js';
import { locations } from '../../db/schema.js';
import { NotFoundError } from '../errors.js';

const locationService = {
  getAllLocations: async (): Promise<Location[]> => {
    return await db.select().from(locations);
  },

  getLocationById: async (id: number): Promise<Location> => {
    const [location] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, id));
    if (!location) throw new NotFoundError(`Location with id ${id} not found`);
    return location;
  },

  getLocationByName: async (locationName: string): Promise<Location> => {
    const [location] = await db
      .select()
      .from(locations)
      .where(eq(locations.name, locationName));
    if (!location)
      throw new NotFoundError(`Location with name ${locationName} not found`);
    return location;
  },

  getLocationIdByName: async (name: string): Promise<number> => {
    const [location] = await db
      .select()
      .from(locations)
      .where(eq(locations.name, name));
    if (!location)
      throw new NotFoundError(`Location with name ${name} not found`);
    return location.id;
  },

  createLocation: async (newLocation: LocationForm): Promise<void> => {
    await db.insert(locations).values({ name: newLocation.name });
  },

  updateLocation: async (id: number, data: LocationForm): Promise<void> => {
    await db
      .update(locations)
      .set({ name: data.name })
      .where(eq(locations.id, id));
  },

  deleteLocation: async (id: number): Promise<void> => {
    await db.delete(locations).where(eq(locations.id, id));
  },
};

export default locationService;
