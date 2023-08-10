import { API_ENDPOINT } from "@/constants/endpoints";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

export const client = axios.create({
	baseURL: API_ENDPOINT,
});

client.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error instanceof AxiosError) {
			if (error.response) {
				console.error("API Error:", error.response.data);
				toast.error(error.response.data.message);
			} else {
				console.error("API Error:", error.cause);
			}
		} else {
			console.error("API Error:", error);
		}

		return Promise.reject(error);
	},
);
