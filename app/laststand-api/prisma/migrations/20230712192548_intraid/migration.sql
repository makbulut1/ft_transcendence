/*
  Warnings:

  - A unique constraint covering the columns `[intra_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `intra_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "intra_id" VARCHAR(30) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_intra_id_key" ON "users"("intra_id");
