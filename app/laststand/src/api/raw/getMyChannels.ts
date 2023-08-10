import { client } from "@/api/axiosClient";
import { Channel } from "@shared/models";

export async function getMyChannels(): Promise<Channel[]> {
	const response = await client.get("/channels/my", {
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
	});
	return response.data;
}
