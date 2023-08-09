import { useEffect } from "react";
import { Socket } from "socket.io-client";

export type SocketAction = (...args: any[]) => void;

export async function useSocketEvent(
	socket: Socket,
	event: string,
	action: SocketAction,
	dependencies: unknown[] = [],
) {
	useEffect(() => {
		if (!socket) throw new Error(`Socket not found`);

		socket.on(event, action);
		return () => {
			socket.off(event, action);
		};
	}, dependencies);
}
