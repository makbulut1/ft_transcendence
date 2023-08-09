import { client } from "@/api/axiosClient";
import { ChannelMember } from "@shared/models";

export async function getMember(memberName: string, channelName: string): Promise<ChannelMember> {
	const response = await client.get("/channels/members", {
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
		params: {
			memberName,
			channelName,
		},
	});

	return response.data;
}
