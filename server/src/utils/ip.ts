import { NextFunction, Request, Response } from 'express';
import { ipToGeolocation } from 'location-from-ip';

export const geolocation = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ipList = [
    '190.50.32.106',
    '40.9.168.70',
    '135.140.204.171',
    '61.9.233.218',
    '33.59.59.171',
    '183.146.40.228',
    '195.104.219.125',
    '100.217.156.195',
    '62.206.217.222',
    '251.7.60.157',
    '223.153.240.91',
    '152.206.220.170',
    '213.59.176.255',
    '164.251.122.33',
    '79.139.43.137',
    '186.78.134.234',
    '166.209.249.144',
    '79.169.132.59',
    '163.22.106.14',
    '111.229.216.172',
    '104.2.166.228',
    '85.55.38.165',
  ];
  const ip = ipList[Math.floor(Math.random() * ipList.length)];
  console.log(ip);
  const data = await ipToGeolocation(ip);
  console.log(data);
  res.locals = data;
  next();
};
