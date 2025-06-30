import cors from 'cors';
import express, { type RequestHandler } from 'express';
import helmet from 'helmet';
import { pingDB } from '../db/db.js';
import { PORT } from './config.js';
import errorHandler from './middleware/errorHandler.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import monkeyRoutes from './routes/monkeyRoutes.js';
import { swaggerDocs, swaggerUi } from './swagger/swagger.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/v1/monkeys', monkeyRoutes);
app.use('/v1/dashboard', dashboardRoutes);

app.listen(PORT, '0.0.0.0', (): void => {
  console.log(`Server is listening on port ${PORT}`);
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
