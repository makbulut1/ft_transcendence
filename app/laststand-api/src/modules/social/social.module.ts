import { ActivityModule } from "@/modules/activity/activity.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { ChannelModule } from "@/modules/channel/channel.module";
import { ChatModule } from "@/modules/chat/chat.module";
import { FriendModule } from "@/modules/friend/friend.module";
import { SocialGateway } from "@/modules/social/social.gateway";
import { UserModule } from "@/modules/user/user.module";
import { Module, forwardRef } from "@nestjs/common";

@Module({
	imports: [
		ChannelModule,
		ChatModule,
		UserModule,
		ActivityModule,
		AuthModule,
		forwardRef(() => FriendModule),
	],
	controllers: [],
	providers: [SocialGateway],
	exports: [SocialGateway],
})
export class SocialModule {}
