/*
  Warnings:

  - The primary key for the `Assets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Wallets` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Assets" DROP CONSTRAINT "Assets_walletId_fkey";

-- AlterTable
ALTER TABLE "Assets" DROP CONSTRAINT "Assets_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "walletId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Assets_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Assets_id_seq";

-- AlterTable
ALTER TABLE "Wallets" DROP CONSTRAINT "Wallets_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Wallets_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Wallets_id_seq";

-- AddForeignKey
ALTER TABLE "Assets" ADD CONSTRAINT "Assets_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
