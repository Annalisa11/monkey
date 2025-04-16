import { RequestHandler } from 'express';
import eventService from '../services/eventService.js';
import axios from 'axios';
import monkeyService from '../services/monkeyService.js';

const storeButtonPressData: RequestHandler = async (req, res) => {
  try {
    const newRowId = await eventService.recordButtonPressData(req.body);
    res.json(newRowId);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const reactToQRCodeScan: RequestHandler = async (req, res) => {
  try {
    const emotion = 'concentrate';
    const id = parseInt(req.params.id);

    const monkey = await monkeyService.getMonkeyById(id);
    if (!monkey) throw Error(`Monkey with id ${id} not found`);

    const monkeyApiUrl = `http://${monkey.address}:${process.env.ROBOT_API_PORT}`;
    console.log('-> MONKEY API URL: ', monkeyApiUrl);
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
export { storeButtonPressData, reactToQRCodeScan };
