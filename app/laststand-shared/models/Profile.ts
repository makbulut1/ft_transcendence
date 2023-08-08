import { Achievement, MatchHistory, User } from ".";

export interface Profile extends User {
	wins: number;
	losses: number;
	matchHistories: MatchHistory[];
	achievements: Achievement[];
	twoFactorAuthEnabled?: boolean;
	isFriend?: boolean;
	isBlocked?: boolean;
	friendRequest?: "incoming" | "outgoing";
}
