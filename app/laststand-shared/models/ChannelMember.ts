import { User } from ".";

export type MemberType = "admin" | "owner" | "member";

export interface ChannelMember {
	user: User;
	type: MemberType;
	banned: boolean;
	muteStart?: Date;
	muteEnd?: Date;
}
