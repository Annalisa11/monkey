import express from 'express';
import { storeButtonPressData } from '../controllers/eventController.js';

const router = express.Router();

/**
 * @swagger
 * /v1/events/button-press:
 *   post:
 *     summary: Record a button press event from a monkey robot
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - monkeyId
 *               - timestamp
 *               - location
 *             properties:
 *               monkeyId:
 *                 type: integer
 *                 example: 1
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-04-14T10:15:30Z
 *               location:
 *                 type: string
 *                 example: "Main Lobby"
 *     responses:
 *       200:
 *         description: Button press recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 42
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */
router.post('/button-press', storeButtonPressData);

export default router;
