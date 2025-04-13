import { NextFunction, Response, Request } from 'express';

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

const { swaggerUi, swaggerDocs } = require('./swagger/swagger');

const monkeyRoutes = require('./routes/monkeyRoutes');

const { db } = require('../db/db');

dotenv.config();

if (!process.env.PORT) {
  console.log(`No port value specified...`);
}

const PORT: number = parseInt((process.env.PORT as string) || '3000', 10);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/v1/monkeys', monkeyRoutes);

app.listen(PORT, (): void => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.url} not found`,
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: err.message || 'Something went wrong',
  });
});

console.log('check the database connection');
db.get('SELECT 1', [], (err: Error) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Database connection successful');
  }
});

export {};
