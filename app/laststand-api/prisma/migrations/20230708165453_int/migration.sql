/*
  Warnings:

  - You are about to alter the column `player1_score` on the `MatchHistory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `player2_score` on the `MatchHistory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `losses` on the `users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `wins` on the `users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "MatchHistory" ALTER COLUMN "player1_score" SET DATA TYPE INTEGER,
ALTER COLUMN "player2_score" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "losses" SET DATA TYPE INTEGER,
ALTER COLUMN "wins" SET DATA TYPE INTEGER;
