/*
  Warnings:

  - You are about to drop the `Assets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wallets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Assets" DROP CONSTRAINT "Assets_walletId_fkey";

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "wallets" SET NOT NULL,
ALTER COLUMN "wallets" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Assets";

-- DropTable
DROP TABLE "Wallets";
