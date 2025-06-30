import db from '../../db/db.js';
import { events } from '../../db/schema.js';

const eventService = {
  async recordEvent({
    eventType,
    journeyId,
    locationId,
    monkeyId,
    action,
  }: {
    eventType: string;
    journeyId?: number;
    locationId: number;
    monkeyId: number;
    action: string;
  }) {
    const metaInfo = { monkeyId, action };
    await db.insert(events).values({
      eventType,
      journeyId,
      locationId,
      timestamp: new Date(),
      metadata: JSON.stringify(metaInfo),
    });
  },
};

export default eventService;
