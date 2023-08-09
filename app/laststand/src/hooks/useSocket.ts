import { SOCKET_ENDPOINT } from "@/constants/endpoints";
import { LOGIN, MATCHMAKER_LOGGED, SOCIAL_LOGGED } from "@shared/socketEvents";
import { useEffect } from "react";
import { Socket, io } from "socket.io-client";

interface SocketItem {
	id: string;
	socket: Socket;
	isLogged?: boolean;
}

function loginSocket(item: SocketItem, loggedEvent: string) {
	function connected() {
		if (!item.isLogged) {
			item.socket.emit(LOGIN, { token: localStorage.getItem("client_token") });
		}
	}

	function logged() {
		item.isLogged = true;
	}

	useEffect(() => {
		if (item.isLogged) {
			return;
		}

		item.socket.on("connect", connected);
		item.socket.on(loggedEvent, logged);
		item.socket.connect();

		return () => {
			if (item.isLogged) {
				return;
			}

			item.socket.off("connect", connected);
			item.socket.off(loggedEvent, logged);
		};
	}, []);
}

export const sockets = [
	{ id: "game", socket: io(`${SOCKET_ENDPOINT}/game`, { autoConnect: false }), isLogged: false },
	{
		id: "social",
		socket: io(`${SOCKET_ENDPOINT}/social`, { autoConnect: false }),
		isLogged: false,
	},
	{
		id: "matchmaker",
		socket: io(`${SOCKET_ENDPOINT}/matchmaker`, { autoConnect: false }),
		isLogged: false,
	},
];

export const useGameSocket = () => sockets.find((x) => x.id == "game")!.socket;
export const useMatchMakerSocket = () => {
	const mm = sockets.find((x) => x.id == "matchmaker")!;
	loginSocket(mm, MATCHMAKER_LOGGED);
	return mm.socket;
};
export const useSocialSocket = () => {
	const social = sockets.find((x) => x.id == "social")!;
	loginSocket(social, SOCIAL_LOGGED);
	return social.socket;
};
