import { Module } from "@nestjs/common";
import { UserService } from "@/modules/user/user.service";
import { DatabaseModule } from "@/modules/database/database.module";
import { UserController } from "@/modules/user/user.controller";
import { ActivityModule } from "@/modules/activity/activity.module";

@Module({
	imports: [DatabaseModule, ActivityModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
