/*
  Warnings:

  - The `ticker` column on the `Asset` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `walletId` on table `Asset` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AssetEnum" AS ENUM ('BRL', 'USD');

-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_walletId_fkey";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "ticker",
ADD COLUMN     "ticker" "AssetEnum" NOT NULL DEFAULT 'BRL',
ALTER COLUMN "walletId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
