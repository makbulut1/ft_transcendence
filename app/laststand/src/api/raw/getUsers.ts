import { client } from "@/api/axiosClient";
import { User } from "@shared/models";

export async function getUsers(): Promise<User[]> {
	const response = await client.get("/users", {
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
	});

	return response.data;
}
