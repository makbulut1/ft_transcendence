/*
  Warnings:

  - You are about to drop the column `lasted` on the `MatchHistory` table. All the data in the column will be lost.
  - You are about to drop the column `match_time` on the `MatchHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MatchHistory" DROP COLUMN "lasted",
DROP COLUMN "match_time";
