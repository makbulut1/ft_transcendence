/*
  Warnings:

  - Made the column `participant_id` on table `channel_members` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "channel_members" ALTER COLUMN "participant_id" SET NOT NULL;
