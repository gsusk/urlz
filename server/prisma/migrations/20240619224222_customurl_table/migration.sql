-- CreateTable
CREATE TABLE "CustomUrl" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shortUrl" TEXT,
    "userId" UUID,
    "original" TEXT,

    CONSTRAINT "CustomUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomUrl_shortUrl_key" ON "CustomUrl"("shortUrl");

-- CreateIndex
CREATE INDEX "CustomUrl_id_idx" ON "CustomUrl"("id");

-- CreateIndex
CREATE INDEX "CustomUrl_shortUrl_idx" ON "CustomUrl"("shortUrl");

-- AddForeignKey
ALTER TABLE "CustomUrl" ADD CONSTRAINT "CustomUrl_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
