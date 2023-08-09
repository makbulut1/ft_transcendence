-- AlterTable
ALTER TABLE "users" ALTER COLUMN "two_factor_auth_enabled" DROP NOT NULL,
ALTER COLUMN "two_factor_auth_enabled" DROP DEFAULT,
ALTER COLUMN "two_factor_auth_enabled" SET DATA TYPE TEXT;
