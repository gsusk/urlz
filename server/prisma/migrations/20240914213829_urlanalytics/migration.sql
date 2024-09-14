-- CreateTable
CREATE TABLE "UrlAnalytics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "urlId" BIGINT NOT NULL,
    "country" TEXT NOT NULL,
    "record" TIMESTAMP NOT NULL,

    CONSTRAINT "UrlAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UrlAnalytics_urlId_key" ON "UrlAnalytics"("urlId");

-- AddForeignKey
ALTER TABLE "UrlAnalytics" ADD CONSTRAINT "UrlAnalytics_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
