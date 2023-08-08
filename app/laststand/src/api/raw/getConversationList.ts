import { client } from "@/api/axiosClient";
import { Conversation } from "@shared/models";

export async function getConversationList(): Promise<Conversation[]> {
	const response = await client.get("/chat/conversations", {
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
	});

	const data = response.data as Conversation[];

	return data.map((x) => ({
		...x,
		messages: x.messages?.map((y) => ({
			...y,
			sentDate: y.sentDate ? new Date(y.sentDate) : undefined,
		})),
	}));
}
