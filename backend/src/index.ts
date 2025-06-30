import cors from 'cors';
import express, { type RequestHandler } from 'express';
import helmet from 'helmet';
import { pingDB } from '../db/db.js';
import { PORT } from './config.js';
import logger from './logger.js';
import errorHandler from './middleware/errorHandler.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import monkeyRoutes from './routes/monkeyRoutes.js';
import { swaggerDocs, swaggerUi } from './swagger/swagger.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use((req, res, next) => {
  logger.request(req);
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/v1/monkeys', monkeyRoutes);
app.use('/v1/dashboard', dashboardRoutes);

app.listen(PORT, '0.0.0.0', (): void => {
  console.log('===================================');
  console.log('\x1b[33m🐒  Welcome to Monkey Backend!  🐒\x1b[0m');
  console.log('===================================');
  console.log(`\x1b[34mServer is listening on port ${PORT}\x1b[0m`);
});

const routeNotFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.url} not found`,
  });
};

app.use(routeNotFoundHandler);
app.use(errorHandler);

console.log('check the database connection');

const initDB = async () => {
  pingDB();
  // await seedData();
};

initDB();
