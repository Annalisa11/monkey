import { count } from 'drizzle-orm';
import db from '../db/db.js';
import { events, journeys, locations, monkeys, routes } from './schema.js';

const fetchAndLogMonkeys = async () => {
  const rows = await db.select().from(monkeys);
  console.log('📋 Monkeys in DB:');
  console.table(rows);
};

const seedLocations = async () => {
  const locationNames = [
    'Main Lobby',
    'Optometrist',
    'Radiology',
    'Emergency Room',
    'Cafeteria',
    'Ward A',
    'Ward B',
    'Pharmacy',
  ];
  await db
    .insert(locations)
    .values(locationNames.map((name) => ({ name })))
    .onConflictDoNothing();
  console.log('✅ Ensured base locations exist');
};

const getAllLocationIds = async () => {
  const locs = await db
    .select({ id: locations.id, name: locations.name })
    .from(locations);
  return locs;
};

const getAllLocations = async () => {
  const locs = await db.select().from(locations);
  return locs;
};

const seedMonkeys = async () => {
  const result = await db.select({ count: count() }).from(monkeys);
  const monkeyCount = result[0].count;
  if (monkeyCount > 0) {
    console.log('🔹 Monkeys already exist, skipping.');
    return;
  }
  const allLocations = await getAllLocationIds();
  await db.insert(monkeys).values([
    {
      name: 'George',
      locationId: allLocations[0]?.id,
      isActive: true,
    },
    {
      name: 'Bonzo',
      locationId: allLocations[1]?.id,
      isActive: false,
    },
  ]);
  console.log('✅ Inserted default monkeys');
};

const seedRoutes = async () => {
  const allLocations = await getAllLocations();
  if (allLocations.length < 4) {
    console.error('❌ Not enough locations to seed routes');
    return;
  }
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (i !== j) {
        await db
          .insert(routes)
          .values({
            sourceLocationId: allLocations[i].id,
            destinationLocationId: allLocations[j].id,
            description: `Route from ${allLocations[i].name} to ${allLocations[j].name}`,
            isAccessible: true,
          })
          .onConflictDoNothing();
      }
    }
  }
  console.log('✅ Inserted generic routes between first four locations');
};

const seedJourneys = async () => {
  const journeyCountResult = await db.select({ count: count() }).from(journeys);
  const journeyCount = journeyCountResult[0].count;
  if (journeyCount > 0) {
    console.log('🔹 Journeys already exist, skipping.');
    return;
  }
  const allLocations = await getAllLocationIds();
  const allRoutes = await db.select().from(routes);
  if (allRoutes.length === 0) {
    console.log('❌ No routes found, skipping journey seeding.');
    return;
  }
  const now = new Date();
  const baseStartTime = new Date(now.getTime() - 3 * 24 * 3600 * 1000); // 3 days ago
  const journeysData = [];
  for (let i = 0; i < 10; i++) {
    const startLoc = allLocations[i % allLocations.length];
    const destLoc = allLocations[(i + 1) % allLocations.length];
    const route = allRoutes.find(
      (r) =>
        r.sourceLocationId === startLoc.id &&
        r.destinationLocationId === destLoc.id
    );
    if (!route) continue;
    const startTime = new Date(baseStartTime.getTime() + i * 3600 * 1000);
    const endTime = new Date(startTime.getTime() + 2 * 3600 * 1000);
    journeysData.push({
      startTime,
      endTime,
      status: 'completed',
      startLocationId: startLoc.id,
      requestedDestinationId: destLoc.id,
      routeId: route.id,
      qrToken: `QRGEN${i}`,
      qrGeneratedAt: new Date(startTime.getTime() + 600000),
      qrScannedAt: new Date(startTime.getTime() + 900000),
    });
  }
  await db.insert(journeys).values(journeysData);
  console.log('✅ Inserted sample journeys');
};

const seedEvents = async () => {
  const eventCountResult = await db.select({ count: count() }).from(events);
  const eventCount = eventCountResult[0].count;
  if (eventCount > 0) {
    console.log('🔹 Events already exist, skipping.');
    return;
  }
  const journeyRows = await db.select().from(journeys).limit(2);
  const allLocations = await getAllLocationIds();
  if (journeyRows.length < 2 || allLocations.length === 0) {
    console.log('❌ Not enough journeys or locations for events.');
    return;
  }
  await db.insert(events).values([
    {
      journeyId: journeyRows[0].id,
      eventType: 'button_press',
      locationId: allLocations[0].id,
      timestamp: new Date(),
      metadata: '{"monkeyId": 1, "action": "start journey"}',
    },
    {
      journeyId: journeyRows[1].id,
      eventType: 'banana_return',
      locationId: allLocations[1].id,
      timestamp: new Date(),
      metadata: '{"monkeyId": 2, "returnTime": "1622520000"}',
    },
  ]);
  console.log('✅ Inserted sample events');
};

const seedData = async () => {
  try {
    console.log('🌱 Starting DB seed...');
    await seedLocations();
    await seedMonkeys();
    await seedRoutes();
    await seedJourneys();
    await seedEvents();
    await fetchAndLogMonkeys();
    console.log('✅ Seed complete');
  } catch (err: any) {
    console.error('❌ Seeding failed:', err.message);
  }
};

export default seedData;
