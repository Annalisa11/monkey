import { InferInsertModel } from 'drizzle-orm';
import db from '../../db/db.js';
import { buttonPressEvents, journeyCompletions } from '../../db/schema.js';

type ButtonPressInsert = InferInsertModel<typeof buttonPressEvents>;
interface EventService {
  recordButtonPressData(data: ButtonPressInsert): Promise<number>;
  recordJourneyCompletion(): Promise<boolean>;
}

const eventService: EventService = {
  recordButtonPressData: async (data: ButtonPressInsert): Promise<number> => {
    const { monkeyId, createdAt, locationId } = data;

    const insertData: ButtonPressInsert = {
      monkeyId,
      createdAt: createdAt,
      locationId,
    };

    const result = await db
      .insert(buttonPressEvents)
      .values(insertData)
      .returning({ insertedId: buttonPressEvents.id });

    return result[0].insertedId;
  },

  recordJourneyCompletion: async (): Promise<boolean> => {
    await db.insert(journeyCompletions).values({});
    return true;
  },
};

export default eventService;
