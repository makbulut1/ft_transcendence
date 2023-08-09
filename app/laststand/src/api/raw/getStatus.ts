import { client } from "@/api/axiosClient";
import { Status } from "@shared/models";

export async function getStatus(friendName?: string): Promise<Status | undefined> {
	const response = await client.get("/friends/status", {
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
		params: {
			friendName,
		},
	});

	const data = response.data;

	if (data == "") {
		return undefined;
	}

	return data;
}
