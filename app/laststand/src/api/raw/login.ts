import { client } from "@/api/axiosClient";
import { JwtUser } from "@shared/models";

export async function login(code: string, tfaCode?: string): Promise<[JwtUser, boolean]> {
	const response = await client.get("/auth", {
		params: {
			code,
			authCode: tfaCode,
		},
	});
	return response.data;
}
