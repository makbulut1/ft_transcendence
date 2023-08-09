import { ActivityModule } from "@/modules/activity/activity.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { DatabaseModule } from "@/modules/database/database.module";
import { FriendModule } from "@/modules/friend/friend.module";
import { AchievementService } from "@/modules/game/achievement.service";
import { GameGateway } from "@/modules/game/game.gateway";
import { GameService } from "@/modules/game/game.service";
import { MatchMakerGateway } from "@/modules/game/matchmaker.gateway";
import { MatchMakerService } from "@/modules/game/matchmaker.service";
import { UserModule } from "@/modules/user/user.module";
import { Module } from "@nestjs/common";

@Module({
	imports: [AuthModule, UserModule, DatabaseModule, ActivityModule, FriendModule],
	controllers: [],
	providers: [MatchMakerGateway, GameGateway, GameService, MatchMakerService, AchievementService],
})
export class GameModule {}
