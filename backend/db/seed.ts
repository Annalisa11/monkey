import db from './db.js';

const seedData = () => {
  db.serialize(() => {
    console.log('🌱 Seeding database...');

    db.run(`
      INSERT OR IGNORE INTO locations (name) VALUES
      ('Main Lobby'),
      ('Optometrist'),
      ('Radiology'),
      ('Emergency Room')
    `);

    db.run(`
        INSERT OR IGNORE INTO routes (source_location_name, destination_location_name, description, is_accessible) VALUES
        ('Main Lobby', 'Optometrist', 'Go straight past reception, turn left after the red statue, and take the stairs to the second floor.', 1),
        ('Optometrist', 'Main Lobby', 'Take the stairs down from the second floor, walk past the red statue, then turn right to reach the main lobby.', 1)
      `);

    console.log('✅ Sample data inserted successfully.');
  });
};

export default seedData;
