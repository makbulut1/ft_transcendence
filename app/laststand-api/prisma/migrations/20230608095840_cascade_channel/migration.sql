-- DropForeignKey
ALTER TABLE "channels" DROP CONSTRAINT "channels_conversation_id_fkey";

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
