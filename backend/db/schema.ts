import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { customType } from 'drizzle-orm/pg-core';

export const locations = sqliteTable('locations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
});

export const monkeys = sqliteTable('monkeys', {
  monkeyId: integer('monkey_id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  locationId: integer('location_id')
    .notNull()
    .references(() => locations.id),
  isActive: integer('is_active', { mode: 'boolean' }).default(sql`0`),
  address: text('address'),
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

export const navigationQrCodes = sqliteTable('navigation_qr_codes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  token: text('token').notNull().unique(),
  routeId: integer('route_id')
    .notNull()
    .references(() => routes.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at').notNull(),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(sql`0`),
  scanned: integer('scanned').default(sql`0`),
});

export const buttonPressEvents = sqliteTable('button_press_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  monkeyId: integer('monkey_id')
    .notNull()
    .references(() => monkeys.monkeyId),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  locationId: integer('location_id')
    .notNull()
    .references(() => locations.id),
});

export const journeyCompletions = sqliteTable('journey_completions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

const dateTimestamp = customType<{ data: Date; driverData: string }>({
  dataType: () => 'text',
  toDriver: (date: Date) => date.toISOString(),
  fromDriver: (str: string) => new Date(str),
});
