import { client } from "@/api/axiosClient";

export async function get2FaQrCode(): Promise<string> {
	const response = await client.get("/auth/qrcode", {
		headers: {
			Authorization: `${localStorage.getItem("client_token")}`,
		},
	});
	return response.data;
}
