/*
  Warnings:

  - Made the column `commentSerialId` on table `Comments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Comments" ALTER COLUMN "commentSerialId" SET NOT NULL;
