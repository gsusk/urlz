/*
  Warnings:

  - You are about to drop the `CustomUrl` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[custom]` on the table `Url` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CustomUrl" DROP CONSTRAINT "CustomUrl_userId_fkey";

-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "custom" TEXT;

-- DropTable
DROP TABLE "CustomUrl";

-- CreateIndex
CREATE UNIQUE INDEX "Url_custom_key" ON "Url"("custom");

-- CreateIndex
CREATE INDEX "Url_custom_idx" ON "Url"("custom");
