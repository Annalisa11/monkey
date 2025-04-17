import { RequestHandler } from 'express';

import monkeyService from '../services/monkeyService.js';

const getAllMonkeys: RequestHandler = async (req, res) => {
  try {
    const monkeys = await monkeyService.getAllMonkeys();

    res.json(monkeys);
  } catch (error: any) {
    console.error('failed to get all monkeys', error.message);
    res.status(500).json({ error: error.message });
  }
};

const createNavigation: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const monkeyId = parseInt(id);
    const monkey = await monkeyService.getMonkeyById(monkeyId);
    console.log('🔹 fetched monkey: ', monkey);

    if (!monkey || !monkey.location.id) {
      res.status(404).json({ error: `Monkey with ID ${monkeyId} not found` });
      return;
    }

    const { destinationLocationName } = req.body;
    const navigationData = await monkeyService.getNavigationInformation({
      monkeyId,
      destinationLocationName,
      currentLocation: monkey.location,
    });
    res.json(navigationData);
  } catch (error: any) {
    console.error('failed to get navigation data', error.message);
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

    if (!isRightDestination) {
      res.status(403).json({
        error: 'Wrong destination or token is invalid/used or other error.',
      });
      return;
    }

    res.status(200).json({ message: 'Destination verified successfully.' });
  } catch (err: any) {
    console.error('failed to verify QR code', err.message);
    res.status(400).json(err.message);
  }
};

export { getAllMonkeys, createNavigation, verifyQRCode };
