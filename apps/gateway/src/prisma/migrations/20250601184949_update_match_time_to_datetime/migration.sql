/*
  Warnings:

  - You are about to drop the column `code` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `didAt` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `way` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[intendId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `time` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `status` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ticketNature" AS ENUM ('PHYSICAL', 'ONLINE');

-- DropIndex
DROP INDEX "Transaction_code_key";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "onSell" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "time",
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "nature" "ticketNature" NOT NULL DEFAULT 'ONLINE',
ADD COLUMN     "valid" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "code",
DROP COLUMN "didAt",
DROP COLUMN "way",
ADD COLUMN     "amountWithFee" INTEGER,
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'CI',
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'XOF',
ADD COLUMN     "intendCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "intendId" TEXT,
ADD COLUMN     "method" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "debitNumber" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TicketDoublons" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ticket_categoryId" TEXT NOT NULL,
    "scanned" BOOLEAN NOT NULL,
    "scannedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "scannedByUserId" TEXT NOT NULL,
    "nature" "ticketNature" NOT NULL,

    CONSTRAINT "TicketDoublons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_intendId_key" ON "Transaction"("intendId");
