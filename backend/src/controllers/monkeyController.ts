import { Response, Request } from 'express';

const monkeyService = require('../services/monkeyService');

const getAllMonkeys = async (req: Request, res: Response) => {
  try {
    const monkeys = await monkeyService.getAllMonkeys();
    console.log('MOnkeys: ', monkeys);
    res.json(monkeys);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllMonkeys };
