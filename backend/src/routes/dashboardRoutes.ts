import express from 'express';
import {
  getOverviewMetrics,
  test,
} from 'src/controllers/dashboardController.js';

const router = express.Router();

/**
 * @swagger
 * /v1/dashboard/overview:
 *   get:
 *     summary: Get general overview metrics for the dashboard
 *     description: Returns general overview metrics such as QR codes printed, QR codes scanned, journeys completed, total interactions, active monkeys, and abandonment rate.
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: A JSON object containing general overview metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrCodesPrinted:
 *                   type: integer
 *                   example: 1287
 *                 qrCodesScanned:
 *                   type: integer
 *                   example: 985
 *                 journeysCompleted:
 *                   type: integer
 *                   example: 743
 *                 totalInteractions:
 *                   type: integer
 *                   example: 1502
 *                 activeMonkeys:
 *                   type: integer
 *                   example: 12
 *                 totalMonkeys:
 *                   type: integer
 *                   example: 15
 *                 abandonmentRate:
 *                   type: number
 *                   format: float
 *                   example: 14.3
 */
router.get('/overview', getOverviewMetrics);

/**
 * @swagger
 * /v1/dashboard/test:
 *   get:
 *     summary: Test endpoint to see HTTP response
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Successfully retrieved test response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Test response success!'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'An unexpected error occurred.'
 */
router.get('/test', test);

export default router;
