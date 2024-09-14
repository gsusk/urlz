import { NextFunction, Request, Response } from 'express';
import { ipToGeolocation } from 'location-from-ip';

export const geolocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.ip) {
    const data = await ipToGeolocation(req.ip);
    console.log(data);
    res.locals = data;
  } else {
    res.locals = {};
  }
  next();
};
