export default {
  schema: './db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './db/monkey.db',
  },
};
