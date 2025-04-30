import express from 'express';
import { validateRequest } from 'middleware/validateRequest.js';
import {
  createMonkeySchema,
  locationFormSchema,
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
 */
router.post('/', validateRequest(createMonkeySchema), createMonkey);

/**
 * @swagger
 * /v1/monkeys/{id}:
 *   delete:
 *     summary: Delete a monkey by ID
 *     tags: [Monkeys]
 */
router.delete('/:id', deleteMonkey);

/**
 * @swagger
 * /v1/monkeys/{id}:
 *   patch:
 *     summary: Edit a monkey by ID
 *     tags: [Monkeys]
 */
router.patch('/:id', validateRequest(createMonkeySchema), editMonkey);

/**
 * @swagger
 * /v1/monkeys/locations:
 *   get:
 *     summary: Get all locations
 *     tags: [Locations]
 */
router.get('/locations', getLocations);

/**
 * @swagger
 * /v1/monkeys/locations:
 *   post:
 *     summary: Create a location
 *     tags: [Locations]
 */
router.post('/locations', validateRequest(locationFormSchema), createLocation);

/**
 * @swagger
 * /v1/monkeys/locations/{id}:
 *   delete:
 *     summary: Delete a location by ID
 *     tags: [Locations]
 */
router.delete('/locations/:id', deleteLocation);

/**
 * @swagger
 * /v1/monkeys/locations/{id}:
 *   patch:
 *     summary: Edit a location by ID
 *     tags: [Locations]
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
 */
router.get('/routes/:sourceLocationId', getRoutes);

/**
 * @swagger
 * /v1/monkeys/routes:
 *   post:
 *     summary: Create a new route
 *     tags: [Routes]
 */
router.post('/routes', validateRequest(routeFormSchema), createRoute);

/**
 * @swagger
 * /v1/monkeys/routes/{startId}/{destId}:
 *   delete:
 *     summary: Delete a route by source and destination ID
 *     tags: [Routes]
 */
router.delete('/routes/:startId/:destId', deleteRoute);

/**
 * @swagger
 * /v1/monkeys/routes:
 *   patch:
 *     summary: Edit an existing route
 *     tags: [Routes]
 */
router.patch('/routes', validateRequest(routeFormSchema), editRoute);

/**
 * @swagger
 * /v1/monkeys/{id}/navigation:
 *   post:
 *     summary: Generate navigation QR code
 *     tags: [Monkeys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NavigationRequest'
 *     responses:
 *       200:
 *         description: Navigation response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NavigationResponse'
 *       404:
 *         description: Monkey or destination not found
 *       500:
 *         description: Server error
 */

router.post('/:id/navigation', createNavigation);

/**
 * @swagger
 * /v1/monkeys/{id}/qr-check:
 *   post:
 *     summary: Verify a scanned QR code
 *     tags: [Monkeys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QRCodeVerificationRequest'
 *     responses:
 *       200:
 *         description: QR code verified
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
 */
router.post('/:id/qr-check', verifyQRCode);

export default router;
