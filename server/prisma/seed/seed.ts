/**
 * ! Executing this script will delete all data in your database and seed it with 10 user.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { PrismaClient } from '@prisma/client';
import randomstring from 'randomstring';
import d from 'random-url';
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
const BASE62C =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const BLENGTH = BigInt(BASE62C.length);
import { ipToGeolocation } from 'location-from-ip';
const encodeBase62 = (id: bigint): string => {
  let shortUrl = '';
  let n = id;
  do {
    const remainder = Number(n % BLENGTH);
    shortUrl = BASE62C[remainder] + shortUrl;
    n /= BLENGTH;
  } while (n > BigInt(0));

  return shortUrl;
};

const agent = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.88 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:118.0) Gecko/20100101 Firefox/118.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_6_8) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15',
];
const index = [1000244427, 1000244431, 1000244439];
async function main() {
  const prisma = new PrismaClient();
  const range = 100000;
  const userID = '8ae72753-6310-4ebe-9783-acae31fce533';
  // await prisma.url.deleteMany({ where: { userId: userID } });

  // for (let i = 0; i < 92000; i++) {
  //   const data = Array.from({ length: 5 }, (_, i) => ({
  //     userId: userID,
  //     original: d('https') + '.com',
  //   }));
  //   const urlid = await prisma.url.createManyAndReturn({
  //     data: data,
  //     select: { id: true },
  //   });
  //   const records: Promise<unknown>[] = [];
  //   for (const record of urlid) {
  //     const d = prisma.url.update({
  //       where: { id: record.id },
  //       data: {
  //         custom: encodeBase62(record.id),
  //       },
  //     });
  //     records.push(d);
  //   }
  //   await Promise.all(records).catch((e) => console.log('this failed!:', e));

    // const ip = ipList[Math.floor(Math.random() * ipList.length)];
    // const dataIp: Record<string, unknown> = await ipToGeolocation(ip).catch(
    //   (e) => {
    //     console.log('error', e);
    //     return null;
    //   },
    // );
    // let ipdata = {};
    // if (dataIp) {
    //   const { zip, is_dst, local_time_unix, state, city, timezone, ...rest } =
    //     dataIp;
    //   ipdata = rest;
    // }
    // const dataFill = Array.from({ length: 5 }, (_, i) => ({
    //   urlId: index[Math.floor(Math.random() * 3)],
    //   ...ipdata,
    //   referrer: [undefined, 'http://discord.com', 'http://tiktok.com'][
    //     Math.floor(Math.random() * 3)
    //   ],
    //   user_agent: agent[Math.floor(Math.random() * 3)],
    // }));

    // await prisma.urlAnalytics.createMany({
    //   data: dataFill,
    // });
  }
}

main();
