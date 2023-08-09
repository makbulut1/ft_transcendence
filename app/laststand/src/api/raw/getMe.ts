import { client } from "@/api/axiosClient";
import { User } from "@shared/models";

export async function getMe(): Promise<User> {
	const response = await client.get("/auth/me", {
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
	});

	return response.data;
}
