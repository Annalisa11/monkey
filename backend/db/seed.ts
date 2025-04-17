import monkeyService from '../src/services/monkeyService.js';
import addPrivateData from './ip.js';
import db from '../db/db.js';
import { monkeys, locations, routes } from '../db/dbSchema.js';
import { eq, sql, count } from 'drizzle-orm';

const fetchAndLogMonkeys = async () => {
  const rows = await db.select().from(monkeys);
  console.log('📋 Current monkeys in database:');
  console.table(rows);
  console.log('-- end fetch and log monkeys');
};

const seedAndPrintMonkeyTable = async () => {
  const result = await db.select({ count: count() }).from(monkeys);
  const monkeyCount = result[0].count;

  if (monkeyCount === 0) {
    const lobbyId = await monkeyService.getLocationIdByName('Main Lobby');
    const optId = await monkeyService.getLocationIdByName('Optometrist');

    await db.insert(monkeys).values([
      { name: 'George', locationId: lobbyId, isActive: true },
      { name: 'Bonzo', locationId: optId, isActive: false },
    ]);

    console.log('🦍 Inserted default monkeys');
  } else {
    console.log('🌱 Database already seeded. Skipping insert.');
  }
  console.log('-- end insert monkeys');
};

const insertRoutes = async () => {
  const sourceId = await monkeyService.getLocationIdByName('Main Lobby');
  const destId = await monkeyService.getLocationIdByName('Optometrist');

  if (sourceId && destId) {
    await db
      .insert(routes)
      .values({
        sourceLocationId: sourceId,
        destinationLocationId: destId,
        description:
          'Go straight past reception, turn left after the red statue, and take the stairs to the second floor.',
        isAccessible: true,
      })
      .onConflictDoNothing();
  } else {
    console.error('❌ One or both locations not found');
  }
  console.log('-- end insert routes');
};

const seedData = async () => {
  try {
    console.log('🌱 Seeding database...');
    console.log('Inserting locations...');

    await db
      .insert(locations)
      .values([
        { name: 'Main Lobby' },
        { name: 'Optometrist' },
        { name: 'Radiology' },
        { name: 'Emergency Room' },
      ])
      .onConflictDoNothing();

    console.log('-- end insert locations');
    console.log('Seeding monkeys...');
    await seedAndPrintMonkeyTable();
    console.log('Inserting routes...');
    await insertRoutes();
    console.log('Seeding private address data...');
    await addPrivateData();
    await fetchAndLogMonkeys();
    console.log('✅ All seed data inserted successfully.');
  } catch (err: any) {
    console.error('❌ Seeding failed:', err.message);
  }
};

export default seedData;
