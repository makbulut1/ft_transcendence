/*
  Warnings:

  - A unique constraint covering the columns `[participant_id]` on the table `channel_members` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "channel_members" ADD COLUMN     "participant_id" BIGINT;

-- AlterTable
ALTER TABLE "participants" ADD COLUMN     "member_id" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "channel_members_participant_id_key" ON "channel_members"("participant_id");

-- AddForeignKey
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
