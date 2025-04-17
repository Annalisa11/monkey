import { type ErrorRequestHandler, type RequestHandler } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { swaggerUi, swaggerDocs } from './swagger/swagger.js';
import monkeyRoutes from './routes/monkeyRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import { pingDB } from '../db/db.js';
import seedData from '../db/seed.js';

dotenv.config();

if (!process.env.PORT) {
  console.log(`No port value specified...`);
}

const PORT: number = parseInt((process.env.PORT as string) || '7000', 10);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/v1/monkeys', monkeyRoutes);
app.use('/v1/events', eventRoutes);

app.listen(PORT, (): void => {
  console.log(`Server is listening on port ${PORT}`);
});

const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.url} not found`,
  });
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: err.message || 'Something went wrong',
  });
};

app.use(notFoundHandler);
app.use(errorHandler);

console.log('check the database connection');

const checkDB = async () => {
  pingDB();
  seedData();
};

checkDB();
