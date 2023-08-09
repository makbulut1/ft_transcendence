-- CreateEnum
CREATE TYPE "AchievementType" AS ENUM ('first_blood');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ladder_level" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "losses" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "two_factor_auth_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wins" BIGINT NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "achievements" (
    "id" BIGSERIAL NOT NULL,
    "user_name" VARCHAR(30) NOT NULL,
    "type" "AchievementType" NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "users"("name") ON DELETE CASCADE ON UPDATE CASCADE;
