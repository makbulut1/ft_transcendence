export type Status = "online" | "offline" | "ingame";

export interface User {
	name: string;
	avatar: string;
	status?: Status;
}
