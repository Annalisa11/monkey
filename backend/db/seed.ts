import monkeyService from '../src/services/monkeyService.js';
import { dbRun, dbGet, dbAll } from './dbUtils.js';
import addPrivateData from './ip.js';
import { Monkey } from './schema.js';

const fetchAndLogMonkeys = async () => {
  const rows = await dbAll(`SELECT * FROM monkeys`);
  console.log('📋 Current monkeys in database:');
  console.table(rows);
  console.log('-- end fetch and log monkeys');
};

const seedAndPrintMonkeyTable = async () => {
  const result: { count: number } = await dbGet(`
    SELECT COUNT(*) as count FROM monkeys
  `);

  if (result.count === 0) {
    const lobbyId = await monkeyService.getLocationIdByName('Main Lobby');
    const optId = await monkeyService.getLocationIdByName('Optometrist');

    await dbRun(
      `
      INSERT INTO monkeys (name, location_id, is_active) VALUES (?, ?, ?), (?, ?, ?)`,
      ['George', lobbyId, 0, 'Bonzo', optId, 1]
    );
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
    await dbRun(
      `INSERT OR IGNORE INTO routes (source_location_id, destination_location_id, description, is_accessible)
       VALUES (?, ?, ?, ?)`,
      [
        sourceId,
        destId,
        'Go straight past reception, turn left after the red statue, and take the stairs to the second floor.',
        1,
      ]
    );
  } else {
    console.error('❌ One or both locations not found');
  }
  console.log('-- end insert routes');
};

const seedData = async () => {
  try {
    console.log('🌱 Seeding database...');

    console.log('Inserting locations...');
    await dbRun(`
      INSERT OR IGNORE INTO locations (name) VALUES
      ('Main Lobby'),
      ('Optometrist'),
      ('Radiology'),
      ('Emergency Room')
    `);
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
