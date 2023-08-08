import { ChannelModule } from "@/modules/channel/channel.module";
import { ChatController } from "@/modules/chat/chat.controller";
import { ChatService } from "@/modules/chat/chat.service";
import { DatabaseModule } from "@/modules/database/database.module";
import { UserModule } from "@/modules/user/user.module";
import { Module } from "@nestjs/common";

@Module({
	imports: [UserModule, DatabaseModule, ChannelModule],
	controllers: [ChatController],
	providers: [ChatService],
	exports: [ChatService],
})
export class ChatModule {}
