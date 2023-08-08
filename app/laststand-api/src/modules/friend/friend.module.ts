import { ActivityModule } from "@/modules/activity/activity.module";
import { ChatModule } from "@/modules/chat/chat.module";
import { DatabaseModule } from "@/modules/database/database.module";
import { FriendController } from "@/modules/friend/friend.controller";
import { FriendService } from "@/modules/friend/friend.service";
import { Module } from "@nestjs/common";

@Module({
	imports: [DatabaseModule, ChatModule, ActivityModule],
	controllers: [FriendController],
	providers: [FriendService],
	exports: [FriendService],
})
export class FriendModule {}
