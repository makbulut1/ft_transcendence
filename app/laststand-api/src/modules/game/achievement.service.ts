import { Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "@/modules/database/database.service";
import { AchievementType } from "@shared/models";

@Injectable()
export class AchievementService {
	private readonly logger = new Logger("Achievement-Service");

	constructor(private readonly databaseService: DatabaseService) {}

	async hasAchievement(username: string, type: AchievementType) {
		const query = await this.prisma.achievement.findFirst({
			where: {
				userName: username,
				type,
			},
		});

		return !!query;
	}

	async earn(username: string, type: AchievementType) {
		await this.prisma.achievement.create({
			data: {
				type,
				userName: username,
			},
		});
	}

	private get prisma() {
		return this.databaseService.prisma;
	}
}
