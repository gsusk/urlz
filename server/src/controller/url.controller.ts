import { createHash } from 'crypto';
import { Request, Response, NextFunction } from 'express';

const BASE62_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const bLength = BASE62_CHARS.length;

const encode = (id: number) => {
  const shortUrl: string[] = [];
  console.log(id);
  let n = id;
  let mod = 0;
  while (n > 0) {
    mod = n % bLength;
    shortUrl.push(BASE62_CHARS[mod]);
    n = Math.floor(n / bLength);
  }
  console.log(shortUrl);
  console.log(n, mod);
  return shortUrl.reverse().join('');
};

const decode = (hash: string) => {
  console.log(hash);
  const chars = hash.split('').reverse();
  let n: number = 0;
  for (let i = 0; i < chars.length; i++) {
    n += BASE62_CHARS.indexOf(chars[i]) * Math.pow(bLength, i);
  }
  console.log(n);
  return n;
};

export const shortenUrl = (
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const { url } = request.body as { url: string };
};
