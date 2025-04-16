import express from 'express';
import {
  reactToQRCodeScan,
  storeButtonPressData,
} from '../controllers/eventController.js';

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

/**
 * @swagger
 * /v1/events/{id}/qr-code-scan:
 *   post:
 *     summary: Trigger "concentrate" emotion on a monkey
 *     description: Looks up a monkey by ID, then sends a request to its FastAPI server to trigger a "concentrate" animation.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the monkey that should react to the QR code scan
 *     responses:
 *       200:
 *         description: Emotion successfully triggered on the monkey
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Emotion triggered on monkey successfully
 *                 emotion:
 *                   type: string
 *                   example: concentrate
 *                 monkeyResponse:
 *                   type: object
 *                   description: The response from the monkey's FastAPI server
 *       404:
 *         description: Monkey with given ID not found
 *       500:
 *         description: Failed to trigger emotion on monkey
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to trigger monkey emotion
 */
router.post('/:id/qr-code-scan', reactToQRCodeScan);

export default router;
