import express from 'express';
import {
  createNavigation,
  getAllMonkeys,
  verifyQRCode,
} from '../controllers/monkeyController.js';

const router = express.Router();

/**
 * @swagger
 * /v1/monkeys:
 *   get:
 *     summary: Returns all monkeys
 *     description: Retrieves a list of all monkeys from the database
 *     tags:
 *       - Monkeys
 *     responses:
 *       200:
 *         description: A list of monkeys
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Monkey'
 *       500:
 *         description: Server error
 */
router.get('/', getAllMonkeys);

/**
 * @swagger
 * /v1/monkeys/{id}/navigation:
 *   post:
 *     summary: Generate navigation data for a monkey
 *     description: Returns navigation instructions and a QR code for the given destination
 *     tags:
 *       - Monkeys
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the monkey requesting navigation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - destinationLocation
 *             properties:
 *               destinationLocation:
 *                 type: string
 *                 example: "Optometrist"
 *     responses:
 *       200:
 *         description: Navigation instructions and QR code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrCode:
 *                   type: string
 *                   format: uri
 *                   description: Base64-encoded QR code image
 *                 destinationId:
 *                   type: integer
 *                 destinationName:
 *                   type: string
 *                 routeDescription:
 *                   type: string
 *                 verificationToken:
 *                   type: string
 *       400:
 *         description: Invalid destination or monkey ID
 *       500:
 *         description: Server error
 */
router.post('/:id/navigation', createNavigation);

/**
 * @swagger
 * /v1/monkeys/{id}/qr-check:
 *   post:
 *     summary: Verify QR code data from a scanned QR
 *     description: Checks if the provided QR code contains a valid token and destination. Returns confirmation if the token is valid and unused and if the patient has scanned it at the right location.
 *     tags:
 *       - Monkeys
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the monkey that scanned the QR code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - destinationId
 *             properties:
 *               token:
 *                 type: string
 *                 example: "205299c9467fcd596f3d629f99364602"
 *               destinationId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: QR code verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Destination verified successfully.
 *       400:
 *         description: Invalid input format (e.g., missing or malformed qrData)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid QR code format or malformed JSON.
 *       403:
 *         description: QR token or destination is invalid or already used
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Wrong destination or token is invalid/used.
 */

router.post('/:id/qr-check', verifyQRCode);

export default router;
