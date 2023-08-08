import { Module } from "@nestjs/common";
import { ActivityService } from "@/modules/activity/activity.service";

@Module({
	imports: [],
	controllers: [],
	providers: [ActivityService],
	exports: [ActivityService],
})
export class ActivityModule {}
