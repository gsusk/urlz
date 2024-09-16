/*
  Warnings:

  - You are about to drop the column `constinent` on the `UrlAnalytics` table. All the data in the column will be lost.
  - You are about to drop the column `localtime` on the `UrlAnalytics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UrlAnalytics" DROP COLUMN "constinent",
DROP COLUMN "localtime",
ADD COLUMN     "continent" VARCHAR(10),
ADD COLUMN     "local_time" TIMESTAMPTZ;
