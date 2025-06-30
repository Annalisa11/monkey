import { eq } from 'drizzle-orm';
import { Monkey, MonkeyForm } from 'validation';
import db from '../../db/db.js';
import { locations, monkeys } from '../../db/schema.js';

const monkeyWithLocationSelect = {
  id: monkeys.monkeyId,
  name: monkeys.name,
  isActive: monkeys.isActive,
  location: {
    id: locations.id,
    name: locations.name,
  },
};

const MonkeyService = {
  getAllMonkeys: async (): Promise<Monkey[]> => {
    return await db
      .select(monkeyWithLocationSelect)
      .from(monkeys)
      .innerJoin(locations, eq(monkeys.locationId, locations.id));
  },

  getMonkeyById: async (monkeyId: number): Promise<Monkey | null> => {
    const [monkey] = await db
      .select(monkeyWithLocationSelect)
      .from(monkeys)
      .innerJoin(locations, eq(monkeys.locationId, locations.id))
      .where(eq(monkeys.monkeyId, monkeyId));
    return monkey || null;
  },

  createMonkey: async (newMonkey: MonkeyForm): Promise<void> => {
    await db.insert(monkeys).values({
      name: newMonkey.name,
      isActive: newMonkey.isActive,
      locationId: newMonkey.location.id,
    });
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

  deleteMonkey: async (id: number): Promise<void> => {
    await db.delete(monkeys).where(eq(monkeys.monkeyId, id));
  },
};

export default MonkeyService;
