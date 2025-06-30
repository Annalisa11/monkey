import { RequestHandler } from 'express';
import { SemanticError } from 'src/errors.js';
import eventService from 'src/services/eventService.js';
import { LocationForm, MonkeyForm, Route, RouteForm } from 'validation';
import logger from '../logger.js';
import JourneyService from '../services/journeyService.js';
import LocationService from '../services/locationService.js';
import MonkeyService from '../services/monkeyService.js';
import RouteService from '../services/routeService.js';

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
    logger.info(`Successfully retrieved ${monkeys.length} monkeys`);
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
    logger.info('Monkey created successfully');
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
    logger.info(`Monkey ${monkeyId} deleted successfully`);

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
    logger.info(`Monkey ${monkeyId} updated successfully`);

    res.status(200).json({ message: 'Monkey updated successfully' });
  } catch (error: any) {
    next(error);
  }
};

const getLocations: RequestHandler = async (req, res, next) => {
  try {
    const locations = await LocationService.getAllLocations();
    logger.info(`Successfully retrieved ${locations.length} locations`);
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
    logger.info('Location created successfully');
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
    logger.info(`Location ${locId} deleted successfully`);

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
    logger.info(`Location ${locId} updated successfully`);

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
    const routes = await RouteService.getRoutesByLocation(sourceLocationId);
    logger.info(
      `Successfully retrieved ${routes.length} routes for location ${sourceLocationId}`
    );
    res.json(routes);
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
    logger.info('Route created successfully');
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
    logger.info(`Route from ${startId} to ${destId} deleted successfully`);

    res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error: any) {
    next(error);
  }
};

const editRoute: RequestHandler<any, any, Route> = async (req, res, next) => {
  try {
    const updateData = req.body;

    await RouteService.updateRoute(updateData);
    logger.info('Route updated successfully');

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

    const navigationData = await JourneyService.createQRCode({
      monkeyId,
      journeyId: req.body.journeyId,
      destinationLocationId: req.body.destinationLocationId,
    });

    logger.info(
      `QR Code created successfully for monkey ${monkeyId}, journey ${req.body.journeyId}`
    );
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
  try {
    const { token, destinationId, journeyId } = req.body;
    const { id } = req.params;
    const monkeyId = parseInt(id, 10);

    //TODO: validate if monkey id is at the right location.

    const isRightDestination = await JourneyService.verifyDestination(
      token,
      destinationId,
      journeyId,
      monkeyId
    );

    if (!isRightDestination) {
      throw new SemanticError('Invalid destination');
    }

    logger.info(`QR code verification successful for monkey ${monkeyId}`);
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
    const monkeyId = parseInt(req.params.id);
    const monkeyInfo = await MonkeyService.getMonkeyById(monkeyId);

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

    logger.info(
      `Button press event recorded for monkey ${monkeyId}, journey ${journeyId}`
    );
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
    const monkeyId = parseInt(req.params.id);
    const monkeyInfo = await MonkeyService.getMonkeyById(monkeyId);

    await eventService.recordEvent({
      eventType: 'banana_return',
      locationId: monkeyInfo.location.id,
      monkeyId: monkeyInfo.id,
      action: 'banana_return',
    });

    logger.info(`Banana return event recorded for monkey ${monkeyId}`);
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
