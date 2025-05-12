import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
// Core entities
export const locations = sqliteTable('locations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
});

export const monkeys = sqliteTable('monkeys', {
  monkeyId: integer('monkey_id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  locationId: integer('location_id').references(() => locations.id, {
    onDelete: 'set null',
  }),
  isActive: integer('is_active', { mode: 'boolean' })
    .notNull()
    .default(sql`0`),
  address: text('address').notNull(),
});

export const routes = sqliteTable(
  'routes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    sourceLocationId: integer('source_location_id')
      .notNull()
      .references(() => locations.id, { onDelete: 'cascade' }),
    destinationLocationId: integer('destination_location_id')
      .notNull()
      .references(() => locations.id, { onDelete: 'cascade' }),
    description: text('description').notNull(),
    isAccessible: integer('is_accessible', { mode: 'boolean' }).default(sql`1`),
  },
  (table) => [unique().on(table.sourceLocationId, table.destinationLocationId)]
);

export const journeys = sqliteTable('journeys', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }),
  status: text('status'), // 'started', 'qr_generated', 'completed'

  startLocationId: integer('start_location_id')
    .notNull()
    .references(() => locations.id),
  requestedDestinationId: integer('requested_destination_id').references(
    () => locations.id
  ),
  routeId: integer('route_id').references(() => routes.id),

  qrToken: text('qr_token').unique(),
  qrGeneratedAt: integer('qr_generated_at', { mode: 'timestamp' }),
  qrScannedAt: integer('qr_scanned_at', { mode: 'timestamp' }),
});

export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  journeyId: integer('journey_id').references(() => journeys.id), // if applicable
  eventType: text('event_type').notNull(), //'banana_return'
  locationId: integer('location_id').references(() => locations.id),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  metadata: text('metadata'), // JSON string for any additional event-specific data
});
