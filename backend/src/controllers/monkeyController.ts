import { RequestHandler } from 'express';
import eventService from 'src/services/eventService.js';
import { LocationForm, MonkeyForm, Route, RouteForm } from 'validation';
import {
  JourneyService,
  LocationService,
  MonkeyService,
  RouteService,
} from '../services/index.js';

type CreateNavigationParams = {
  id: string;
};

type CreateNavigationData = {
  destinationLocationId: number;
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

const getAllMonkeys: RequestHandler = async (req, res, next) => {
  try {
    const monkeys = await MonkeyService.getAllMonkeys();
    console.log('------ TEST get monkeys call ', monkeys);
    res.json(monkeys);
  } catch (error: any) {
    next(error);
  }
};

const createMonkey: RequestHandler<any, any, MonkeyForm> = async (
  req,
  res,
  next
) => {
  try {
    await MonkeyService.createMonkey(req.body);

    res.status(201).json({ message: 'Monkey created successfully' });
  } catch (error: any) {
    next(error);
  }
};

const deleteMonkey: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const monkeyId = parseInt(id, 10);

    await MonkeyService.deleteMonkey(monkeyId);

    res.status(200).json({ message: 'Monkey deleted successfully' });
  } catch (error: any) {
    next(error);
  }
};

const editMonkey: RequestHandler<any, any, MonkeyForm> = async (
  req,
  res,
  next
) => {
  try {
    const monkeyId = parseInt(req.params.id, 10);
    const updateData = req.body;

    await MonkeyService.updateMonkey(monkeyId, updateData);

    res.status(200).json({ message: 'Monkey updated successfully' });
  } catch (error: any) {
    next(error);
  }
};

const getLocations: RequestHandler = async (req, res, next) => {
  try {
    const locations = await LocationService.getAllLocations();
    console.log('Get Locations request received', locations);
    res.json(locations);
  } catch (error: any) {
    next(error);
  }
};

const createLocation: RequestHandler<any, any, LocationForm> = async (
  req,
  res,
  next
) => {
  try {
    await LocationService.createLocation(req.body);

    res.status(201).json({ message: 'Location created successfully' });
  } catch (error: any) {
    next(error);
  }
};

const deleteLocation: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const locId = parseInt(id, 10);

    await LocationService.deleteLocation(locId);

    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error: any) {
    next(error);
  }
};

const editLocation: RequestHandler<any, any, LocationForm> = async (
  req,
  res,
  next
) => {
  try {
    const locId = parseInt(req.params.id, 10);
    const updateData = req.body;

    await LocationService.updateLocation(locId, updateData);

    res.status(200).json({ message: 'Location updated successfully' });
  } catch (error: any) {
    next(error);
  }
};

const getRoutes: RequestHandler<{ sourceLocationId: number }> = async (
  req,
  res,
  next
) => {
  try {
    const sourceLocationId = req.params.sourceLocationId;
    const locations = await RouteService.getRoutesByLocation(sourceLocationId);
    res.json(locations);
  } catch (error: any) {
    next(error);
  }
};

const createRoute: RequestHandler<any, any, RouteForm> = async (
  req,
  res,
  next
) => {
  try {
    await RouteService.createRoute(req.body);

    res.status(201).json({ message: 'Route created successfully' });
  } catch (error: any) {
    next(error);
  }
};

const deleteRoute: RequestHandler<{ startId: string; destId: string }> = async (
  req,
  res,
  next
) => {
  try {
    const startId = parseInt(req.params.startId);
    const destId = parseInt(req.params.destId);

    await RouteService.deleteRoute(startId, destId);

    res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error: any) {
    next(error);
  }
};

const editRoute: RequestHandler<any, any, Route> = async (req, res, next) => {
  try {
    const updateData = req.body;
    console.log('🔹 updateData: ', updateData);

    await RouteService.updateRoute(updateData);

    res.status(200).json({ message: 'Route updated successfully' });
  } catch (error: any) {
    next(error);
  }
};

const createNavigation: RequestHandler<
  CreateNavigationParams,
  any,
  CreateNavigationData
> = async (req, res, next) => {
  try {
    const monkeyId = parseInt(req.params.id);
    const monkey = await MonkeyService.getMonkeyById(monkeyId);
    console.log('🔹 fetched monkey: ', monkey);
    console.log('🔹 req.body: ', req.body);

    const navigationData = await JourneyService.createQRCode({
      monkeyId,
      journeyId: req.body.journeyId,
      destinationLocationId: req.body.destinationLocationId,
    });

    res.json(navigationData);
  } catch (error: any) {
    next(error);
  }
};

const verifyQRCode: RequestHandler<
  VerifyQRCodeParams,
  any,
  VerifyQRCodeData
> = async (req, res, next) => {
  console.log('🔹 verifyQRCode called with body: ', req.body);
  try {
    const { token, destinationId, journeyId } = req.body;
    const { id } = req.params;
    const monkeyId = parseInt(id, 10);

    //TODO: validate if monkey id is at the right location.

    console.log('destructured data: ', token, destinationId);

    // TODO: handle errors better
    const isRightDestination = await JourneyService.verifyDestination(
      token,
      destinationId,
      journeyId,
      monkeyId
    );

    if (!isRightDestination) {
      return;
    }

    res.status(200).json({ message: 'Destination verified successfully.' });
  } catch (err: any) {
    next(err);
  }
};

const handleButtonPressEvent: RequestHandler<{ id: string }, any, any> = async (
  req,
  res,
  next
) => {
  try {
    const monkeyInfo = await MonkeyService.getMonkeyById(
      parseInt(req.params.id)
    );

    const journeyId = await JourneyService.recordNewJourney(
      monkeyInfo.location.id
    );
    await eventService.recordEvent({
      eventType: 'button_press',
      journeyId,
      locationId: monkeyInfo.location.id,
      monkeyId: monkeyInfo.id,
      action: 'button_press',
    });
    res.status(200).json({ journeyId });
  } catch (err: any) {
    next(err);
  }
};

const handleBananaReturnEvent: RequestHandler<
  { id: string },
  any,
  any
> = async (req, res, next) => {
  try {
    const monkeyInfo = await MonkeyService.getMonkeyById(
      parseInt(req.params.id)
    );

    await eventService.recordEvent({
      eventType: 'banana_return',
      locationId: monkeyInfo.location.id,
      monkeyId: monkeyInfo.id,
      action: 'banana_return',
    });
    res
      .status(200)
      .json({ message: 'Banana return event recorded successfully' });
  } catch (err: any) {
    next(err);
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
