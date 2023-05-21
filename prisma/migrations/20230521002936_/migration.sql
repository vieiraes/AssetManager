/*
  Warnings:

  - You are about to drop the `Assets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wallets` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "createdAt" DROP DEFAULT;

-- DropTable
DROP TABLE "Assets";

-- DropTable
DROP TABLE "Wallets";
