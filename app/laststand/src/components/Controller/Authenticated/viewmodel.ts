import { ReactNode } from "react";
import { getMe } from "@/api/raw/getMe";
import { useAuthStore } from "@/stores/useAuthStore";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

export interface AuthenticatedProps {
	children?: ReactNode;
	redirect?: string;
}

export type AuthStatus = "validating" | "invalid" | "error" | "ok";

export function useViewModel() {
	const [status, setStatus] = useState<AuthStatus>("validating");
	const auth = useAuthStore();

	useEffect(() => {
		if (localStorage.getItem("client_token")) {
			getMe()
				.then((response) => {
					auth.login(
						response.name,
						localStorage.getItem("client_token")!,
						response.avatar,
					);
					setStatus("ok");
				})
				.catch((err) => {
					if (err instanceof AxiosError && err.response?.status == 401) {
						// Unauthorized error
						auth.logout(); // Be sure username and token reset.
						setStatus("invalid");
					} else {
						setStatus("error");
					}
				});
		} else {
			setStatus("ok");
		}
	}, []);

	return {
		status,
		auth,
	};
}
