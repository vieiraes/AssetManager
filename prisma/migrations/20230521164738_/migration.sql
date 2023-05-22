/*
  Warnings:

  - A unique constraint covering the columns `[ticker]` on the table `Assets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Assets_ticker_key" ON "Assets"("ticker");
