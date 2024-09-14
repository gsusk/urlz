/*
  Warnings:

  - You are about to drop the column `record` on the `UrlAnalytics` table. All the data in the column will be lost.
  - You are about to alter the column `country` on the `UrlAnalytics` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- DropIndex
DROP INDEX "UrlAnalytics_urlId_key";

-- AlterTable
ALTER TABLE "UrlAnalytics" DROP COLUMN "record",
ADD COLUMN     "constinent" VARCHAR(10),
ADD COLUMN     "countryCode" VARCHAR(10),
ADD COLUMN     "latitude" REAL,
ADD COLUMN     "localtime" TIMESTAMPTZ,
ADD COLUMN     "longitude" REAL,
ADD COLUMN     "referrer" TEXT,
ADD COLUMN     "user_agent" TEXT,
ADD COLUMN     "visitedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "country" SET DATA TYPE VARCHAR(100);
