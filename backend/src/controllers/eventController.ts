import { RequestHandler } from 'express';
import eventService from '../services/eventService.js';

const storeButtonPressData: RequestHandler = async (req, res) => {
  try {
    const newRowId = await eventService.recordButtonPressData(req.body);
    res.json(newRowId);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { storeButtonPressData };
