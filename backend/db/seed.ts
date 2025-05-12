import { and, count, eq } from 'drizzle-orm';
import db from '../db/db.js';
import monkeyService from '../src/services/monkeyService.js';
import addPrivateData from './ip.js';
import { events, journeys, locations, monkeys, routes } from './schema.js';

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
    {
      name: 'George',
      locationId: lobbyId,
      isActive: true,
      address: '192.168.1.105',
    },
    {
      name: 'Bonzo',
      locationId: optId,
      isActive: false,
      address: '192.168.1.105',
    },
  ]);

  console.log('✅ Inserted default monkeys');
};

const seedRoutes = async () => {
  const sourceId = await monkeyService.getLocationIdByName('Main Lobby');
  const destId = await monkeyService.getLocationIdByName('Optometrist');
  const destIdRad = await monkeyService.getLocationIdByName('Radiology');
  const destIdER = await monkeyService.getLocationIdByName('Emergency Room');

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

  await db
    .insert(routes)
    .values({
      sourceLocationId: destId,
      destinationLocationId: sourceId,
      description:
        'Exit office, down the stairs, right at the statue, towards reception.',
      isAccessible: true,
    })
    .onConflictDoNothing();

  console.log('✅ Inserted route Optometrist → Main Lobby');

  await db
    .insert(routes)
    .values({
      sourceLocationId: sourceId,
      destinationLocationId: destIdRad,
      description: 'Take elevator to floor -1, first door on the left.',
      isAccessible: true,
    })
    .onConflictDoNothing();

  console.log('✅ Inserted route Main Lobby → Radiology');

  await db
    .insert(routes)
    .values({
      sourceLocationId: sourceId,
      destinationLocationId: destIdER,
      description: 'Go right, then straight until you see a big door.',
      isAccessible: true,
    })
    .onConflictDoNothing();

  console.log('✅ Inserted route Main Lobby → Emergency Room');
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

const seedJourneys = async () => {
  const journeyCountResult = await db.select({ count: count() }).from(journeys);
  const journeyCount = journeyCountResult[0].count;

  if (journeyCount > 0) {
    console.log('🔹 Journeys already exist, skipping.');
    return;
  }

  const lobbyId = await monkeyService.getLocationIdByName('Main Lobby');
  const optId = await monkeyService.getLocationIdByName('Optometrist');
  const destIdRad = await monkeyService.getLocationIdByName('Radiology');
  const destIdER = await monkeyService.getLocationIdByName('Emergency Room');
  const routeId = await db
    .select({ id: routes.id })
    .from(routes)
    .where(
      and(
        eq(routes.sourceLocationId, lobbyId),
        eq(routes.destinationLocationId, optId)
      )
    )
    .limit(1)
    .execute();

  const routeIdRad = await db
    .select({ id: routes.id })
    .from(routes)
    .where(
      and(
        eq(routes.sourceLocationId, lobbyId),
        eq(routes.destinationLocationId, destIdRad)
      )
    );

  const routeIdER = await db
    .select({ id: routes.id })
    .from(routes)
    .where(
      and(
        eq(routes.sourceLocationId, lobbyId),
        eq(routes.destinationLocationId, destIdER)
      )
    );

  if (!routeId || !routeIdRad || !routeIdER || routeId.length === 0) {
    console.log('❌ Route not found, skipping journey seeding.');
    return;
  }

  const generateRandomTimestamp = (start: number, end: number) => {
    return Math.floor(Math.random() * (end - start + 1) + start);
  };

  const journeysData = [];

  const now = new Date();
  const twoDaysAgo = new Date(now.setDate(now.getDate() - 2));

  const subtractDays = (days: number) => {
    const date = new Date(now);
    date.setDate(now.getDate() - days);
    return date;
  };

  const baseStartTime =
    new Date(
      Date.UTC(
        twoDaysAgo.getFullYear(),
        twoDaysAgo.getMonth(),
        twoDaysAgo.getDate(),
        8,
        0,
        0
      )
    ).getTime() / 1000;

  const baseEndTime =
    new Date(
      Date.UTC(
        twoDaysAgo.getFullYear(),
        twoDaysAgo.getMonth(),
        twoDaysAgo.getDate(),
        18,
        0,
        0
      )
    ).getTime() / 1000;

  for (let i = 1; i <= 10; i++) {
    const startTime = generateRandomTimestamp(baseStartTime, baseEndTime); // Random start time within the interval
    const endTime = generateRandomTimestamp(
      startTime + 3600,
      startTime + 10800
    ); // Random end time 1-3 hours after start time
    const qrGeneratedAt = generateRandomTimestamp(
      startTime + 600,
      endTime - 600
    ); // QR generated 10 minutes to 10 minutes before end time
    const qrScannedAt = qrGeneratedAt + Math.floor(Math.random() * 600); // QR scanned 0-10 minutes after QR generation

    const status = 'completed';

    let sourceId = lobbyId;
    let destId = optId;
    let defaultRouteId = routeId;

    if (i === 5 || i === 6) {
      destId = destIdRad;
      defaultRouteId = routeIdRad;
    }
    if (i === 7) {
      destId = destIdER;
      defaultRouteId = routeIdER;
    }

    journeysData.push({
      startTime: new Date(startTime * 1000), // Convert Unix timestamp to Date
      endTime: new Date(endTime * 1000), // Convert Unix timestamp to Date
      status: status,
      startLocationId: sourceId,
      requestedDestinationId: destId,
      routeId: defaultRouteId[0].id,
      qrToken: `QR1234${i}`,
      qrGeneratedAt: new Date(qrGeneratedAt * 1000), // Convert Unix timestamp to Date
      qrScannedAt: status === 'completed' ? new Date(qrScannedAt * 1000) : null, // Convert Unix timestamp to Date
    });
  }

  // 3 days ago, 4 days ago, and 5 days ago
  const journeyDates = [
    subtractDays(3), // 3 days ago
    subtractDays(4), // 4 days ago
    subtractDays(5), // 5 days ago
  ];

  const specificJourneys = [
    {
      startTime:
        new Date(journeyDates[0].setHours(9, 0, 0, 0)).getTime() / 1000, // Start at 9:00 AM, 3 days ago
      endTime: new Date(journeyDates[0].setHours(11, 0, 0, 0)).getTime() / 1000, // End at 11:00 AM, 3 days ago
      status: 'qr_generated',
      qrGeneratedAt:
        new Date(journeyDates[0].setHours(9, 30, 0, 0)).getTime() / 1000, // QR generated at 9:30 AM, 3 days ago
      qrScannedAt: null,
    },
    {
      startTime:
        new Date(journeyDates[1].setHours(10, 30, 0, 0)).getTime() / 1000, // Start at 10:30 AM, 4 days ago
      endTime:
        new Date(journeyDates[1].setHours(12, 30, 0, 0)).getTime() / 1000, // End at 12:30 PM, 4 days ago
      status: 'qr_generated',
      qrGeneratedAt:
        new Date(journeyDates[1].setHours(11, 0, 0, 0)).getTime() / 1000, // QR generated at 11:00 AM, 4 days ago
      qrScannedAt: null,
    },
    {
      startTime:
        new Date(journeyDates[2].setHours(13, 0, 0, 0)).getTime() / 1000, // Start at 1:00 PM, 5 days ago
      endTime:
        new Date(journeyDates[2].setHours(14, 30, 0, 0)).getTime() / 1000, // End at 2:30 PM, 5 days ago
      status: 'started',
      qrGeneratedAt: null, // Not generated yet
      qrScannedAt: null, // Not scanned yet
    },
  ];

  // Insert 10 unique journeys
  await db.insert(journeys).values(journeysData);
  await db.insert(journeys).values(
    specificJourneys.map((journey, i) => ({
      startTime: new Date(journey.startTime * 1000), // Convert Unix timestamp to Date
      endTime: new Date(journey.endTime * 1000), // Convert Unix timestamp to Date
      status: journey.status,
      startLocationId: lobbyId,
      requestedDestinationId: optId,
      routeId: routeId[0].id,
      qrToken: `QR1234SP${i}`, // Unique QR Token for specific journeys
      qrGeneratedAt: journey.qrGeneratedAt
        ? new Date(journey.qrGeneratedAt * 1000)
        : null, // Convert Unix timestamp to Date
      qrScannedAt: journey.qrScannedAt
        ? new Date(journey.qrScannedAt * 1000)
        : null, // Convert Unix timestamp to Date
    }))
  );

  console.log('✅ Inserted sample journeys');
};

const seedEvents = async () => {
  const eventCountResult = await db.select({ count: count() }).from(events);
  const eventCount = eventCountResult[0].count;

  if (eventCount > 0) {
    console.log('🔹 Events already exist, skipping.');
    return;
  }

  const journey1 = await db
    .select({ id: journeys.id })
    .from(journeys)
    .where(eq(journeys.qrToken, 'QR12345'))
    .limit(1)
    .execute();
  const journey2 = await db
    .select({ id: journeys.id })
    .from(journeys)
    .where(eq(journeys.qrToken, 'QR12346'))
    .limit(1)
    .execute();

  const locationId = await monkeyService.getLocationIdByName('Main Lobby');

  if (journey1.length === 0 || journey2.length === 0) {
    console.log('❌ Journeys not found, skipping events seeding.');
    return;
  }

  await db.insert(events).values([
    {
      journeyId: journey1[0].id,
      eventType: 'button_press',
      locationId: locationId,
      timestamp: new Date('2021-06-01T10:00:00Z'),
      metadata: '{"monkeyId": 1, "action": "start journey"}',
    },
    {
      journeyId: journey2[0].id,
      eventType: 'banana_return',
      locationId: locationId,
      timestamp: new Date('2021-06-01T14:00:00Z'),
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
    await seedJourneys(); // Seed journeys
    await seedEvents(); // Seed events
    await addPrivateData();

    await fetchAndLogMonkeys();

    console.log('✅ Seed complete');
  } catch (err: any) {
    console.error('❌ Seeding failed:', err.message);
  }
};

export default seedData;
