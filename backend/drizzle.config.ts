export default {
  schema: './db/dbSchema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './db/monkey.db',
  },
};
