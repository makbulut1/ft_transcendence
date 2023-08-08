import { client } from "@/api/axiosClient";
import { Profile } from "@shared/models";

export async function getProfile(username?: string): Promise<Profile> {
	const response = await client.get("/users/profile", {
		params: {
			username,
		},
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
	});

	return response.data;
}
