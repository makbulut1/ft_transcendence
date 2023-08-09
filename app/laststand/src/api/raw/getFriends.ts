import { client } from "@/api/axiosClient";
import { User } from "@shared/models";

export async function getFriends(): Promise<User[]> {
	const response = await client.get("/friends", {
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
	});

	return response.data;
}
