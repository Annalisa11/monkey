import express from 'express';
import { validateRequest } from 'middleware/validateRequest.js';
import { createMonkeySchema, updateMonkeySchema } from 'validation';
import {
  createMonkey,
  createNavigation,
  deleteMonkey,
  editMonkey,
  getAllMonkeys,
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

router.post('/', validateRequest(createMonkeySchema), createMonkey);

router.delete('/:id', deleteMonkey);

router.patch('/:id', validateRequest(updateMonkeySchema), editMonkey);

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
