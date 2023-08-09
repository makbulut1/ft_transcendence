/*
  Warnings:

  - You are about to drop the column `participant_id` on the `channel_members` table. All the data in the column will be lost.
  - You are about to drop the column `member_id` on the `participants` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "channel_members" DROP CONSTRAINT "channel_members_participant_id_fkey";

-- DropIndex
DROP INDEX "channel_members_participant_id_key";

-- AlterTable
ALTER TABLE "channel_members" DROP COLUMN "participant_id";

-- AlterTable
ALTER TABLE "participants" DROP COLUMN "member_id";
