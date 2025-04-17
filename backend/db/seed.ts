import monkeyService from '../src/services/monkeyService.js';
import addPrivateData from './ip.js';
import db from '../db/db.js';
import { monkeys, locations, routes } from './schema.js';
import { eq, count } from 'drizzle-orm';

const fetchAndLogMonkeys = async () => {
  const rows = await db.select().from(monkeys);
  console.log('📋 Monkeys in DB:');
  console.table(rows);
};

const seedMonkeys = async () => {
  const result = await db.select({ count: count() }).from(monkeys);
  const monkeyCount = result[0].count;

  if (monkeyCount > 0) {
    console.log('🔹 Monkeys already exist, skipping.');
    return;
  }

  const lobbyId = await monkeyService.getLocationIdByName('Main Lobby');
  const optId = await monkeyService.getLocationIdByName('Optometrist');

  await db.insert(monkeys).values([
    { name: 'George', locationId: lobbyId, isActive: true },
    { name: 'Bonzo', locationId: optId, isActive: false },
  ]);

  console.log('✅ Inserted default monkeys');
};

const seedRoutes = async () => {
  const sourceId = await monkeyService.getLocationIdByName('Main Lobby');
  const destId = await monkeyService.getLocationIdByName('Optometrist');

  if (!sourceId || !destId) {
    console.error('❌ Cannot seed routes, missing location IDs');
    return;
  }

  await db
    .insert(routes)
    .values({
      sourceLocationId: sourceId,
      destinationLocationId: destId,
      description:
        'Past reception, left after red statue, stairs to 2nd floor.',
      isAccessible: true,
    })
    .onConflictDoNothing();

  console.log('✅ Inserted route Main Lobby → Optometrist');
};

const seedLocations = async () => {
  await db
    .insert(locations)
    .values([
      { name: 'Main Lobby' },
      { name: 'Optometrist' },
      { name: 'Radiology' },
      { name: 'Emergency Room' },
    ])
    .onConflictDoNothing();

  console.log('✅ Inserted base locations');
};

const seedData = async () => {
  try {
    console.log('🌱 Starting DB seed...');

    await seedLocations();
    await seedMonkeys();
    await seedRoutes();
    await addPrivateData();
    await fetchAndLogMonkeys();

    console.log('✅ Seed complete');
  } catch (err: any) {
    console.error('❌ Seeding failed:', err.message);
  }
};

export default seedData;
