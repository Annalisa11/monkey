import express from 'express';
import { validateRequest } from 'src/middleware/validateRequest.js';
import {
  locationFormSchema,
  monkeyFormSchema,
  routeFormSchema,
} from 'validation';
import {
  createLocation,
  createMonkey,
  createNavigation,
  createRoute,
  deleteLocation,
  deleteMonkey,
  deleteRoute,
  editLocation,
  editMonkey,
  editRoute,
  getAllMonkeys,
  getLocations,
  getRoutes,
  handleButtonPressEvent,
  verifyQRCode,
} from '../controllers/monkeyController.js';

const router = express.Router();

/**
 * @swagger
 * /v1/monkeys:
 *   get:
 *     summary: Get all monkeys
 *     tags: [Monkeys]
 *     responses:
 *       200:
 *         description: List of monkeys
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Monkey'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */

router.get('/', getAllMonkeys);

/**
 * @swagger
 * /v1/monkeys:
 *   post:
 *     summary: Create a new monkey
 *     tags: [Monkeys]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MonkeyForm'
 *     responses:
 *       201:
 *         description: Monkey created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Monkey created successfully'
 */

router.post('/', validateRequest(monkeyFormSchema), createMonkey);

/**
 * @swagger
 * /v1/monkeys/{id}:
 *   delete:
 *     summary: Delete a monkey by ID
 *     tags: [Monkeys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the monkey to delete
 *     responses:
 *       200:
 *         description: Monkey deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Monkey deleted successfully'
 */

router.delete('/:id', deleteMonkey);

/**
 * @swagger
 * /v1/monkeys/{id}:
 *   patch:
 *     summary: Edit a monkey by ID
 *     tags: [Monkeys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the monkey to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MonkeyForm'
 *     responses:
 *       200:
 *         description: Monkey updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Monkey updated successfully'
 */

router.patch('/:id', validateRequest(monkeyFormSchema), editMonkey);

/**
 * @swagger
 * /v1/monkeys/locations:
 *   get:
 *     summary: Get all locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: List of all locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */

router.get('/locations', getLocations);

/**
 * @swagger
 * /v1/monkeys/locations:
 *   post:
 *     summary: Create a location
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationForm'
 *     responses:
 *       201:
 *         description: Location created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Location created successfully'
 */

router.post('/locations', validateRequest(locationFormSchema), createLocation);

/**
 * @swagger
 * /v1/monkeys/locations/{id}:
 *   delete:
 *     summary: Delete a location by ID
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the location to delete
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Location deleted successfully'

 */

router.delete('/locations/:id', deleteLocation);

/**
 * @swagger
 * /v1/monkeys/locations/{id}:
 *   patch:
 *     summary: Edit a location by ID
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the location to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationForm'
 *     responses:
 *       200:
 *         description: Location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Location updated successfully'
 */

router.patch(
  '/locations/:id',
  validateRequest(locationFormSchema),
  editLocation
);

/**
 * @swagger
 * /v1/monkeys/routes/{sourceLocationId}:
 *   get:
 *     summary: Get routes for a given source location
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: sourceLocationId
 *         required: true
 *         schema:
 *           type: integer
 *           description: The source location ID to get routes for
 *     responses:
 *       200:
 *         description: List of routes for the source location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Route'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */

router.get('/routes/:sourceLocationId', getRoutes);

/**
 * @swagger
 * /v1/monkeys/routes:
 *   post:
 *     summary: Create a new route
 *     tags: [Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RouteForm'
 *     responses:
 *       201:
 *         description: Route created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Route created successfully'
 */

router.post('/routes', validateRequest(routeFormSchema), createRoute);

/**
 * @swagger
 * /v1/monkeys/routes/{startId}/{destId}:
 *   delete:
 *     summary: Delete a route by source and destination ID
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: startId
 *         required: true
 *         schema:
 *           type: integer
 *           description: The source location ID of the route to delete
 *       - in: path
 *         name: destId
 *         required: true
 *         schema:
 *           type: integer
 *           description: The destination location ID of the route to delete
 *     responses:
 *       200:
 *         description: Route deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Route deleted successfully'
 */

router.delete('/routes/:startId/:destId', deleteRoute);

/**
 * @swagger
 * /v1/monkeys/routes:
 *   patch:
 *     summary: Edit an existing route
 *     tags: [Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RouteForm'
 *     responses:
 *       200:
 *         description: Route updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Route updated successfully'

 */

router.patch('/routes', validateRequest(routeFormSchema), editRoute);

/**
 * @swagger
 * /v1/monkeys/{id}/navigation:
 *   post:
 *     summary: Generate navigation description and QR code for a path request
 *     tags: [Monkeys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the monkey where the request is being made
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNavigation'
 *     responses:
 *       200:
 *         description: Successfully generated navigation QR code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NavigationResponse'
 *       404:
 *         description: Monkey or destination not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.post('/:id/navigation', createNavigation);

/**
 * @swagger
 * /v1/monkeys/{id}/qr-check:
 *   post:
 *     summary: Verify a scanned QR code for a monkey's journey
 *     tags: [Monkeys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the monkey where the QR code is being verified
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyQRCode'
 *     responses:
 *       200:
 *         description: QR code verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       403:
 *         description: Token or destination invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.post('/:id/qr-check', verifyQRCode);

/**
 * @swagger
 * /v1/monkeys/{id}/button-press:
 *   post:
 *     summary: Record a button press event and create a new journey for a monkey
 *     tags: [Monkeys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: The ID of the monkey pressing the button
 *     responses:
 *       200:
 *         description: Button press event recorded and new journey created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 journeyId:
 *                   type: integer
 *                   description: The ID of the newly created journey
 *       404:
 *         description: Monkey not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.post('/:id/button-press', handleButtonPressEvent);

export default router;
