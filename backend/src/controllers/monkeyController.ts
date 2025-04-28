import { RequestHandler } from 'express';
import monkeyService from '../services/monkeyService.js';

type CreateNavigationParams = {
  id: string;
};

type CreateNavigationData = {
  destinationLocationName: string;
};

type VerifyQRCodeParams = {
  id: string;
};

type VerifyQRCodeData = {
  token: string;
  destinationId: number;
};

const getAllMonkeys: RequestHandler = async (req, res) => {
  try {
    const monkeys = await monkeyService.getAllMonkeys();
    res.json(monkeys);
  } catch (error: any) {
    console.error('Failed to get all monkeys', error.message);
    res.status(500).json({ error: error.message });
  }
};

const createNavigation: RequestHandler<
  CreateNavigationParams,
  any,
  CreateNavigationData
> = async (req, res) => {
  try {
    const monkeyId = parseInt(req.params.id);
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
    console.error('Failed to get navigation data', error.message);
    res.status(500).json({ error: error.message });
  }
};

const verifyQRCode: RequestHandler<
  VerifyQRCodeParams,
  any,
  VerifyQRCodeData
> = async (req, res) => {
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
    console.error('Failed to verify QR code', err.message);
    res.status(400).json({ error: err.message });
  }
};

export { createNavigation, getAllMonkeys, verifyQRCode };
