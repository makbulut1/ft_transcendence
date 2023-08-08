import jwt from "jsonwebtoken";
import { GameRoom } from "@/classes/GameRoom";
import { Injectable, Logger } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { Player } from "@shared/types";
import { DatabaseService } from "@/modules/database/database.service";

@Injectable()
export class GameService {
	private readonly logger = new Logger("Game-Service");
	private gameRooms = Map<string, GameRoom>;

	constructor(private readonly databaseService: DatabaseService) {}

	async finishGame(token: string, winner: Player, loser: Player) {
		const game = this.getGame(token);

		if (game) {
			await this.prisma.$transaction([
				this.prisma.user.update({
					where: { name: loser.name },
					data: { losses: { increment: 1 } },
				}),
				this.prisma.user.update({
					where: { name: winner.name },
					data: { wins: { increment: 1 } },
				}),
				this.prisma.matchHistory.create({
					data: {
						player1Score: winner.score,
						player2Score: loser.score,
						player1Name: winner.name,
						player2Name: loser.name,
					},
				}),
			]);
			this.removeGame(game.token);
		}
	}

	createGame(p1: Player, p2: Player) {
		const matchSecret = uuidv4();
		const token = jwt.sign(
			{
				p1name: p1.name,
				p2name: p2.name,
			},
			matchSecret,
		);
		const room = new GameRoom(matchSecret, token);
		room.addPlayer(p1);
		room.addPlayer(p2);
		this.logger.log(`Match created: ${p1.name} VS ${p2.name}.`);
		this.gameRooms[token] = room;
		return room;
	}

	getGame(token: string): GameRoom | undefined {
		return this.gameRooms[token];
	}

	removeGame(token: string) {
		this.gameRooms[token] = undefined;
	}

	private get prisma() {
		return this.databaseService.prisma;
	}
}
