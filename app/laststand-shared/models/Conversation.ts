import { Message } from ".";

export interface Conversation {
	name: string;
	type: "private" | "channel";
	image?: string;
	messages?: Message[];
}
