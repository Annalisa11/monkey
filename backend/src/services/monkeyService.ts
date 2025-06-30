import { eq } from 'drizzle-orm';
import { Monkey, MonkeyForm } from 'validation';
import db from '../../db/db.js';
import { locations, monkeys } from '../../db/schema.js';
import { NotFoundError } from '../errors.js';

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

  getMonkeyById: async (monkeyId: number): Promise<Monkey> => {
    const [monkey] = await db
      .select(monkeyWithLocationSelect)
      .from(monkeys)
      .innerJoin(locations, eq(monkeys.locationId, locations.id))
      .where(eq(monkeys.monkeyId, monkeyId));
    if (!monkey)
      throw new NotFoundError(`Monkey with id ${monkeyId} not found`);
    return monkey;
  },

  createMonkey: async (newMonkey: MonkeyForm): Promise<void> => {
    await db.insert(monkeys).values({
      name: newMonkey.name,
      isActive: newMonkey.isActive,
      locationId: newMonkey.location.id,
    });
  },

  updateMonkey: async (id: number, data: MonkeyForm): Promise<void> => {
    const result = await db
      .update(monkeys)
      .set({
        name: data.name,
        isActive: data.isActive,
        locationId: data.location.id,
      })
      .where(eq(monkeys.monkeyId, id));

    if (result.changes === 0) {
      throw new NotFoundError(`Monkey with id ${id} not found`);
    }
  },

  deleteMonkey: async (id: number): Promise<void> => {
    const result = await db.delete(monkeys).where(eq(monkeys.monkeyId, id));

    if (result.changes === 0) {
      throw new NotFoundError(`Monkey with id ${id} not found`);
    }
  },
};

export default MonkeyService;
