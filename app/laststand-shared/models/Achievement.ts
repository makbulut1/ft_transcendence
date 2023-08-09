export interface Achievement {
	type: AchievementType;
	info: string;
}

export enum AchievementType {
	firstBlood = "first_blood",
}
