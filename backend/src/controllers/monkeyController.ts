import { RequestHandler } from 'express';

import monkeyService from '../services/monkeyService.js';

const getAllMonkeys: RequestHandler = async (req, res) => {
  try {
    const monkeys = await monkeyService.getAllMonkeys();
    console.log('MOnkeys: ', monkeys);
    res.json(monkeys);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { getAllMonkeys };
