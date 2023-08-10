import { client } from "@/api/axiosClient";
import { Channel } from "@shared/models";

export async function getAvailableChannels(): Promise<Channel[]> {
	const response = await client.get("/channels/available", {
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
	});
	return response.data;
}
