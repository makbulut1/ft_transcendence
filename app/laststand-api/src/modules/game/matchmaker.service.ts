import { Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "@/modules/database/database.service";
import { Player } from "@shared/types";
import { GameRoom } from "@/classes/GameRoom";
import { GameService } from "@/modules/game/game.service";

@Injectable()
export class MatchMakerService {
	private readonly logger = new Logger("MatchMaker-Service");
	private waitQueue: Player[] = [];

	constructor(
		private readonly databaseService: DatabaseService,
		private readonly gameService: GameService,
	) {}

	getMatch(forPlayerName: string): GameRoom | undefined {
		const player = this.waitQueue.find((x) => x.name == forPlayerName);
		const rival = this.waitQueue.find((x) => x.name != forPlayerName);

		if (player && rival) {
			this.waitQueue = this.waitQueue.filter(
				(x) => x.name != player.name && x.name != rival.name,
			);
			return this.gameService.createGame(player, rival);
		}
	}

	addToQueue(player: Player) {
		if (!this.isWaiting(player.name)) {
			this.logger.log(`${player.name} is in the queue.`);
			this.waitQueue.push(player);
		}
	}

	removeFromQueue(username: string) {
		this.waitQueue = this.waitQueue.filter((x) => x.name != username);
		this.logger.log(`${username} canceled match search.`);
	}

	isWaiting(username: string): boolean {
		return !!this.waitQueue.find((x) => x.name == username);
	}

	private get prisma() {
		return this.databaseService.prisma;
	}
}
