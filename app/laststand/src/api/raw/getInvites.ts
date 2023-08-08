import { client } from "@/api/axiosClient";
import { ChannelInvite } from "@shared/models";

export async function getInvites(): Promise<ChannelInvite[]> {
	const response = await client.get("/channels/invites", {
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
	});

	return response.data;
}
