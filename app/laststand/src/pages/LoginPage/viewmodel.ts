import { login } from "@/api/raw/login";
import { useAuthStore } from "@/stores/useAuthStore";
import { ERR_AUTH_ERROR } from "@shared/errorCodes";
import { LSError } from "@shared/types";
import { AxiosError } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export function useViewModel() {
	const [searchParams] = useSearchParams();
	const [tfaCode, setTfaCode] = useState<string>("");
	const [tfaEnabled, setTfaEnabled] = useState<boolean>(false);
	const navigate = useNavigate();
	const code = searchParams.get("code");
	const auth = useAuthStore();

	// Functions
	async function loginToAccount() {
		if (localStorage.getItem("client_token")) {
			return;
		}

		if (!code) {
			return;
		}

		auth.beginLogging();
		try {
			const [user, firstLogin] = await login(code, tfaCode);
			if (user.twoFactorAuthEnabled) {
				setTfaEnabled(true);
				return;
			}
			auth?.login(user.username, user.token!, user.avatar);
			localStorage.setItem("firstLogin", firstLogin ? "true" : "false");
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error(err.response?.data.message);
				console.error("Login.API error:", err.response?.data);

				const info = err.response?.data as LSError;
				if (info?.code == ERR_AUTH_ERROR) {
					auth.logout(); // Be sure username and token reset.
					navigate("/", { replace: true });
				}
			} else {
				console.error("Login.API error:", err);
			}
		} finally {
			auth.endLogging();
		}
	}

	// UI events
	function handleTfaInputChange(event: ChangeEvent<HTMLInputElement>) {
		setTfaCode(event.target.value);
	}
	function handleVerifyCodeClick() {
		loginToAccount();
	}

	useEffect(() => {
		loginToAccount();
	}, []);

	return {
		auth,
		tfaEnabled,
		tfaCode,
		handleTfaInputChange,
		handleVerifyCodeClick,
	};
}
