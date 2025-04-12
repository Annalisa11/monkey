const express = require('express');
const monkeyController = require('../controllers/monkeyController');

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
router.get('/', monkeyController.getAllMonkeys);

module.exports = router;
