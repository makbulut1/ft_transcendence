import { client } from "@/api/axiosClient";
import { User } from "@shared/models";

export async function getIncomingRequests(): Promise<User[]> {
	const response = await client.get("/friends/requests/incoming", {
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
	});

	return response.data;
}
