/*
  Warnings:

  - You are about to drop the column `mute` on the `channel_members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "channel_members" DROP COLUMN "mute",
ADD COLUMN     "mute_end" TIMESTAMP(1),
ADD COLUMN     "mute_start" TIMESTAMP(1);
