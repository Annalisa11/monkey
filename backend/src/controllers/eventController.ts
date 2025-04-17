import { RequestHandler } from 'express';
import eventService from '../services/eventService.js';
import axios from 'axios';
import monkeyService from '../services/monkeyService.js';
import { ROBOT_API_PORT } from '../config.js';
import { Emotion } from '../types.js';

const storeButtonPressData: RequestHandler = async (req, res) => {
  try {
    const locationId = await monkeyService.getLocationIdByName(
      req.body.location
    );

    const payload = {
      monkeyId: req.body.monkeyId,
      timestamp: req.body.timestamp,
      locationId: locationId,
    };
    const newRowId = await eventService.recordButtonPressData(payload);
    res.json(newRowId);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const reactToQRCodeScan: RequestHandler = async (req, res) => {
  try {
    const emotion: Emotion = 'concentrate';
    const id = parseInt(req.params.id);

    const monkey = await monkeyService.getMonkeyById(id);
    if (!monkey) res.status(500).json(`Monkey with id ${id} not found`);

    const monkeyApiUrl = `http://${monkey.address}:${ROBOT_API_PORT}`;
    console.log('🔹 MONKEY API URL: ', monkeyApiUrl);
    const response = await axios.get(`${monkeyApiUrl}/${emotion}`);

    res.status(200).json({
      message: 'Emotion triggered on monkey successfully',
      emotion,
      monkeyResponse: response.data,
    });
  } catch (error: any) {
    console.error('Failed to trigger emotion on monkey:', error.message);
    res.status(500).json({ error: 'Failed to trigger monkey emotion' });
  }
};

const reactToJourneyComplete: RequestHandler = async (req, res) => {
  try {
    await eventService.recordJourneyCompletion();

    res
      .status(200)
      .json({ message: 'successfully registered completed journey' });
  } catch (error: any) {
    console.error('Failed to react to journey completion:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export { storeButtonPressData, reactToQRCodeScan, reactToJourneyComplete };
