import { ChannelMember } from ".";

export type ChannelType = "public" | "protected" | "private";

export interface Channel {
	name: string;
	type: ChannelType;
	members?: ChannelMember[];
}
