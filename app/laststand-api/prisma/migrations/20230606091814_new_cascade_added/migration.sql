-- DropForeignKey
ALTER TABLE "blocked_users" DROP CONSTRAINT "blocked_users_blocked_by_user_name_fkey";

-- DropForeignKey
ALTER TABLE "blocked_users" DROP CONSTRAINT "blocked_users_blocked_user_name_fkey";

-- DropForeignKey
ALTER TABLE "channel_members" DROP CONSTRAINT "channel_members_channel_name_fkey";

-- DropForeignKey
ALTER TABLE "channel_members" DROP CONSTRAINT "channel_members_user_name_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_owner_name_fkey";

-- DropForeignKey
ALTER TABLE "participants" DROP CONSTRAINT "participants_user_name_fkey";

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_owner_name_fkey" FOREIGN KEY ("owner_name") REFERENCES "users"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "users"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "users"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_channel_name_fkey" FOREIGN KEY ("channel_name") REFERENCES "channels"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_users" ADD CONSTRAINT "blocked_users_blocked_user_name_fkey" FOREIGN KEY ("blocked_user_name") REFERENCES "users"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_users" ADD CONSTRAINT "blocked_users_blocked_by_user_name_fkey" FOREIGN KEY ("blocked_by_user_name") REFERENCES "users"("name") ON DELETE CASCADE ON UPDATE CASCADE;
