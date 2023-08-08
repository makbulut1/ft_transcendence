import { client } from "@/api/axiosClient";
import { Channel } from "@shared/models";

export async function getChannelInfo(channelName: string): Promise<Channel> {
	const response = await client.get(`/channels`, {
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
		params: {
			name: channelName,
		},
	});
	return response.data;
}
