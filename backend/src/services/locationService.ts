import { eq } from 'drizzle-orm';
import { Location, LocationForm } from 'validation';
import db from '../../db/db.js';
import { locations } from '../../db/schema.js';

const LocationService = {
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

export default LocationService;
