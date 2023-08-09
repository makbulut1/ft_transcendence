import { RoomPlayer } from "@/types/RoomPlayer.type";
import { v4 as uuidv4 } from "uuid";

export class Room {
	public id: string;
	private players: (RoomPlayer | undefined)[] = [undefined, undefined];

	constructor() {
		this.id = uuidv4();
	}

	addPlayer(player: RoomPlayer) {
		if (!this.players[0]) this.players[0] = player;
		else if (!this.players[1]) this.players[1] = player;
	}

	removePlayer(username: string) {
		const index = this.players.findIndex((x) => x?.name == username);

		if (index != -1) {
			this.players[index] = undefined;
		}
	}

	isPlayerIn(username: string): boolean {
		return !!this.players.find((x) => x?.name == username);
	}

	get p1(): RoomPlayer | undefined {
		return this.players[0];
	}

	get p2(): RoomPlayer | undefined {
		return this.players[1];
	}

	get readyToGo(): boolean {
		return this.players.every((x) => !!x);
	}

	get hasPlayer(): boolean {
		return this.players.some((x) => !!x);
	}
}
