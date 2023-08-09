import { client } from "@/api/axiosClient";
import { User } from "@shared/models";

export async function getPossibleFriends(): Promise<User[]> {
	const response = await client.get("/friends/possible", {
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
	});

	return response.data;
}
