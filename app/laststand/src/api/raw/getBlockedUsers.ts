import { client } from "@/api/axiosClient";
import { User } from "@shared/models";

export async function getBlockedUsers(): Promise<User[]> {
	const response = await client.get("/users/blocked", {
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
	});
	return response.data;
}
