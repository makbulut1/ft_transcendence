import { client } from "@/api/axiosClient";
import { User } from "@shared/models";

export async function getWaitingRequests(): Promise<User[]> {
	const response = await client.get("/friends/requests/waiting", {
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
	});

	return response.data;
}
