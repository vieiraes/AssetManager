-- DropForeignKey
ALTER TABLE "Wallets" DROP CONSTRAINT "Wallets_userId_fkey";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "wallets" TEXT[];
