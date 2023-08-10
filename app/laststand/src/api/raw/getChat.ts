import { client } from "@/api/axiosClient";
import { Conversation } from "@shared/models";

export async function getChat(
	conversation: Conversation,
	fillMessages: boolean = true,
): Promise<Conversation> {
	const response = await client.get("/chat/conversations", {
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
		params: {
			conversation: {
				name: conversation.name,
				type: conversation.type,
			},
			fillMessages,
		},
	});

	const data: Conversation = response.data;

	if (data.messages) {
		data.messages = data.messages.map((x) => ({
			...x,
			sentDate: x.sentDate ? new Date(x.sentDate) : undefined,
		}));
	}

	return data;
}
