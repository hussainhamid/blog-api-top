/*
  Warnings:

  - A unique constraint covering the columns `[commentSerialId]` on the table `Comments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "commentSerialId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Comments_commentSerialId_key" ON "Comments"("commentSerialId");
