/*
  Warnings:

  - Added the required column `chainId` to the `Tx` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Tx` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenName` to the `Tx` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tx" ADD COLUMN     "chainId" INTEGER NOT NULL,
ADD COLUMN     "icon" TEXT NOT NULL,
ADD COLUMN     "tokenName" TEXT NOT NULL;
