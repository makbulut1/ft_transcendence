import { create } from "zustand";

interface AuthStore {
	username?: string;
	avatar?: string;
	token?: string;
	isLogging: boolean;
	login: (username: string, token: string, avatar: string) => void;
	logout: () => void;
	beginLogging: () => void;
	endLogging: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	username: undefined,
	token: undefined,
	isLogging: false,
	beginLogging() {
		set(() => ({ isLogging: true }));
	},
	endLogging() {
		set(() => ({ isLogging: false }));
	},
	login(username, token, avatar) {
		localStorage.setItem("client_token", token);
		set(() => ({
			username,
			token,
			avatar,
		}));
	},
	logout() {
		localStorage.removeItem("client_token");
		set(() => ({
			username: undefined,
			token: undefined,
		}));
	},
}));
