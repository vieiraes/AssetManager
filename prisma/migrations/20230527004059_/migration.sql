/*
  Warnings:

  - A unique constraint covering the columns `[ticker]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `ticker` on the `Asset` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "ticker",
ADD COLUMN     "ticker" TEXT NOT NULL;

-- DropEnum
DROP TYPE "AssetEnum";

-- CreateIndex
CREATE UNIQUE INDEX "Asset_ticker_key" ON "Asset"("ticker");
