-- AlterTable
ALTER TABLE "channel_members" ALTER COLUMN "type" SET DEFAULT 'member',
ALTER COLUMN "banned" SET DEFAULT false,
ALTER COLUMN "mute" SET DEFAULT 0;
