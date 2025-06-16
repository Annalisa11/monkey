import { RequestHandler } from 'express';
import { LocationForm, MonkeyForm, Route, RouteForm } from 'validation';
import monkeyService from '../services/monkeyService.js';

type CreateNavigationParams = {
  id: string;
};

type CreateNavigationData = {
  destinationLocationName: string;
  journeyId: number;
};

type VerifyQRCodeParams = {
  id: string;
};

type VerifyQRCodeData = {
  token: string;
  destinationId: number;
  journeyId: number;
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

const createMonkey: RequestHandler<any, any, MonkeyForm> = async (req, res) => {
  try {
    await monkeyService.createMonkey(req.body);

    res.status(201).json({ message: 'Monkey created successfully' });
  } catch (error: any) {
    console.error('Failed to create new monkey', error.message);
    res.status(400).json({ error: error.message });
  }
};

const deleteMonkey: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    const monkeyId = parseInt(id, 10);

    await monkeyService.deleteMonkey(monkeyId);

    res.status(200).json({ message: 'Monkey deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete monkey', error.message);
    res.status(400).json({ error: error.message });
  }
};

const editMonkey: RequestHandler<any, any, MonkeyForm> = async (req, res) => {
  try {
    const monkeyId = parseInt(req.params.id, 10);
    const updateData = req.body;

    await monkeyService.updateMonkey(monkeyId, updateData);

    res.status(200).json({ message: 'Monkey updated successfully' });
  } catch (error: any) {
    console.error('Failed to update monkey', error.message);
    res.status(500).json({ error: error.message });
  }
};

const getLocations: RequestHandler = async (req, res) => {
  try {
    const locations = await monkeyService.getLocations();
    res.json(locations);
  } catch (error: any) {
    console.error('Failed to get all locations', error.message);
    res.status(500).json({ error: error.message });
  }
};

const createLocation: RequestHandler<any, any, LocationForm> = async (
  req,
  res
) => {
  try {
    await monkeyService.createLocation(req.body);

    res.status(201).json({ message: 'Location created successfully' });
  } catch (error: any) {
    console.error('Failed to create new location', error.message);
    res.status(400).json({ error: error.message });
  }
};

const deleteLocation: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    const locId = parseInt(id, 10);

    await monkeyService.deleteLocation(locId);

    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete location', error.message);
    res.status(400).json({ error: error.message });
  }
};

const editLocation: RequestHandler<any, any, LocationForm> = async (
  req,
  res
) => {
  try {
    const locId = parseInt(req.params.id, 10);
    const updateData = req.body;

    await monkeyService.updateLocation(locId, updateData);

    res.status(200).json({ message: 'Location updated successfully' });
  } catch (error: any) {
    console.error('Failed to update location', error.message);
    res.status(500).json({ error: error.message });
  }
};

const getRoutes: RequestHandler<{ sourceLocationId: number }> = async (
  req,
  res
) => {
  try {
    const sourceLocationId = req.params.sourceLocationId;
    const locations = await monkeyService.getRoutesByLocation(sourceLocationId);
    res.json(locations);
  } catch (error: any) {
    console.error('Failed to get all locations', error.message);
    res.status(500).json({ error: error.message });
  }
};

const createRoute: RequestHandler<any, any, RouteForm> = async (req, res) => {
  try {
    await monkeyService.createRoute(req.body);

    res.status(201).json({ message: 'Route created successfully' });
  } catch (error: any) {
    console.error('Failed to create new route', error.message);
    res.status(400).json({ error: error.message });
  }
};

const deleteRoute: RequestHandler<{ startId: string; destId: string }> = async (
  req,
  res
) => {
  try {
    const startId = parseInt(req.params.startId);
    const destId = parseInt(req.params.destId);

    await monkeyService.deleteRoute(startId, destId);

    res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete route', error.message);
    res.status(400).json({ error: error.message });
  }
};

const editRoute: RequestHandler<any, any, Route> = async (req, res) => {
  try {
    const updateData = req.body;
    console.log('🔹 updateData: ', updateData);

    await monkeyService.updateRoute(updateData);

    res.status(200).json({ message: 'Route updated successfully' });
  } catch (error: any) {
    console.error('Failed to update route', error.message);
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

    const navigationData = await monkeyService.createQRCode({
      monkeyId,
      journeyId: req.body.journeyId,
      destinationLocationName: req.body.destinationLocationName,
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
    const { token, destinationId, journeyId } = req.body;
    console.log(token, destinationId);

    // TODO: handle errors better
    const isRightDestination = await monkeyService.verifyDestination(
      token,
      destinationId,
      journeyId
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

const handleButtonPressEvent: RequestHandler<{ id: string }, any, any> = async (
  req,
  res
) => {
  try {
    const monkeyInfo = await monkeyService.getMonkeyById(
      parseInt(req.params.id)
    );
    if (!monkeyInfo) {
      res.status(404).json({ error: 'Monkey not found' });
      return;
    }

    const journeyId = await monkeyService.recordNewJourney(
      monkeyInfo.location.id
    );
    await monkeyService.recordButtonPressEvent(monkeyInfo.id, journeyId);
    res.status(200).json({ journeyId });
  } catch (err: any) {
    console.error('Failed to record button press', err.message);
    res.status(400).json({ error: err.message });
  }
};
const handleBananaReturnEvent: RequestHandler<
  { id: string },
  any,
  any
> = async (req, res) => {
  try {
    const monkeyInfo = await monkeyService.getMonkeyById(
      parseInt(req.params.id)
    );
    if (!monkeyInfo) {
      res.status(404).json({ error: 'Monkey not found' });
      return;
    }

    await monkeyService.recordBananaReturnEvent(monkeyInfo.id);
    res
      .status(200)
      .json({ message: 'Banana return event recorded successfully' });
  } catch (err: any) {
    console.error('Failed to record banana return event', err.message);
    res.status(400).json({ error: err.message });
  }
};

export {
  createLocation,
  createMonkey,
  createNavigation,
  createRoute,
  deleteLocation,
  deleteMonkey,
  deleteRoute,
  editLocation,
  editMonkey,
  editRoute,
  getAllMonkeys,
  getLocations,
  getRoutes,
  handleBananaReturnEvent,
  handleButtonPressEvent,
  verifyQRCode,
};
