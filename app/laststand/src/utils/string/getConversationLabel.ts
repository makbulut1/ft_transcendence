import { Conversation } from "@shared/models";

export function getConversationLabel(conversation: Conversation): string {
	return (conversation.type == "channel" ? "#" : "") + conversation.name;
}
