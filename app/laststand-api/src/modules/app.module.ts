import { Module } from "@nestjs/common";
import { FriendModule } from "@/modules/friend/friend.module";
import { ChatModule } from "@/modules/chat/chat.module";
import { UserModule } from "@/modules/user/user.module";
import { ChannelModule } from "@/modules/channel/channel.module";
import { SocialModule } from "@/modules/social/social.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { GameModule } from "@/modules/game/game.module";

@Module({
	imports: [
		FriendModule,
		ChatModule,
		UserModule,
		ChannelModule,
		SocialModule,
		AuthModule,
		GameModule,
		ServeStaticModule.forRoot({
			rootPath: `${process.cwd()}/cdn`,
			serveRoot: "/cdn",
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
