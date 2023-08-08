import { Achievement, AchievementType } from "../models/Achievement";

export const achievements: Achievement[] = [
	{
		type: AchievementType.firstBlood,
		info: "You played a game with someone for first time.",
	},
];

export function getAchievementInfo(type: AchievementType): string {
	return achievements.find((x) => x.type == type)!.info;
}
