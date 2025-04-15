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

const createNavigation: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const monkeyId = parseInt(id);
    const monkey = await monkeyService.getMonkeyById(monkeyId);
    if (!monkey || !monkey.location) {
      throw Error('Monkey or its location not found');
    }
    const currentLocation = monkey.location;
    const { destinationLocation } = req.body;
    const navigationData = await monkeyService.getNavigationInformation({
      monkeyId,
      destinationLocation,
      currentLocation,
    });
    res.json(navigationData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const verifyQRCode: RequestHandler = async (req, res) => {
  try {
    const { token, destinationId } = req.body;
    console.log(token, destinationId);

    const isRightDestination = await monkeyService.verifyDestination(
      token,
      destinationId
    );

    if (isRightDestination) {
      res.status(200).json({ message: 'Destination verified successfully.' });
      return;
    }

    res.status(403).json({
      error: 'Wrong destination or token is invalid/used or other error.',
    });
  } catch (err: any) {
    res.status(400).json(err.message);
  }
};

export { getAllMonkeys, createNavigation, verifyQRCode };
