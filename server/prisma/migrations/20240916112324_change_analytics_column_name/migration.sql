/*
  Warnings:

  - You are about to drop the column `countryCode` on the `UrlAnalytics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UrlAnalytics" DROP COLUMN "countryCode",
ADD COLUMN     "country_code" VARCHAR(10);
