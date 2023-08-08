import jwt from "jsonwebtoken";
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import {
	ACHIEVEMENT_EARNED,
	BALL_UPDATE,
	FRIEND_IN_GAME,
	FRIEND_OFFLINE,
	FRIEND_ONLINE,
	JOIN_MATCH,
	MATCH_CANCEL,
	MATCH_INIT,
	MATCH_OVER,
	PLAYER_DROP,
	PLAYER_MOVE,
	PLAYER_MOVED,
	PLAYER_RECONNECT,
	PLAYER_SCORED,
	WENT_WRONG,
} from "@shared/socketEvents";
import { AuthService } from "@/modules/auth/auth.service";
import { GameService } from "@/modules/game/game.service";
import { JoinMatchDTO } from "@/modules/game/dto/JoinMatch.dto";
import { GAME_DOESNT_EXISTS } from "@/error/errors";
import { PlayerMovedDTO } from "@/modules/game/dto/PlayerMoved.dto";
import { GameJWT } from "@/types/GameJWT.interface";
import { BallUpdateDTO } from "@/modules/game/dto/BallUpdate.dto";
import { ActivityService } from "@/modules/activity/activity.service";
import { SocketExceptionFilter } from "@/filters/socketexception.filter";
import { AchievementService } from "@/modules/game/achievement.service";
import { AchievementType, Status } from "@shared/models";
import { FriendService } from "@/modules/friend/friend.service";

@WebSocketGateway(+process.env.SOCKET_PORT, { namespace: "game", cors: true })
export class GameGateway implements OnGatewayDisconnect {
	private readonly logger = new Logger("Game-Socket");

	@WebSocketServer()
	private server: Server;

	constructor(
		private readonly friendService: FriendService,
		private readonly gameService: GameService,
		private readonly achievementService: AchievementService,
		private readonly activityService: ActivityService,
	) {}

	async checkFirstBlood(username: string) {
		const has = await this.achievementService.hasAchievement(
			username,
			AchievementType.firstBlood,
		);

		if (!has) {
			await this.achievementService.earn(username, AchievementType.firstBlood);
			return true;
		}

		return false;
	}

	handleDisconnect(@ConnectedSocket() client: Socket) {
		const game = this.gameService.getGame(client.data["token"]);

		if (game) {
			this.activityService.setActivity(client.data["username"], "offline");
			this.logger.log(`${client.data.username} disconnected`);
			if (game.p1?.socket?.id == client?.id) {
				game.p1.socket = undefined;
				this.logger.log(`Player ${game.p1.name} dropped. Waiting...`);
			} else {
				game.p2.socket = undefined;
				this.logger.log(`Player ${game.p2.name} dropped. Waiting...`);
			}

			if (!game.hasPlayer) {
				this.logger.log(`Waited too long. ${game.p1.name} vs ${game.p2.name} removed`);
				this.gameService.removeGame(game.token);
				return;
			}

			if (!game.isWaiting) {
				game.startWaitConnect(() => {
					this.logger.log(`Waited too long. ${game.p1.name} vs ${game.p2.name} removed`);
					this.server.to(game.token).emit(MATCH_CANCEL);
					this.gameService.removeGame(game.token);
				});
			}
			this.server.to(game.token).emit(PLAYER_DROP);
		}
	}

	@UsePipes(new ValidationPipe())
	@UseFilters(new SocketExceptionFilter())
	@SubscribeMessage(JOIN_MATCH)
	async joinMatch(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: JoinMatchDTO,
	) {
		const game = this.gameService.getGame(data.token);
		if (!game) {
			throw GAME_DOESNT_EXISTS();
		}
		try {
			const gameJwt = jwt.verify(data.token, game.secret) as GameJWT;

			if (!game.p1.socket) {
				game.p1.socket = client;
				client.data["username"] = gameJwt.p1name;
			} else if (!game.p2.socket) {
				game.p2.socket = client;
				client.data["username"] = gameJwt.p2name;
			}

			client.data["token"] = data.token;

			if (!game.lastUpdateData) {
				data.gameData.leftPlayer = { ...data.gameData.leftPlayer, ...game.p1Data };
				data.gameData.rightPlayer = { ...data.gameData.rightPlayer, ...game.p2Data };
				data.gameData.ball.direction = game.generateRandomBallDirection();
				game.lastUpdateData = data.gameData;
			}
		} catch (err) {
			this.logger.error(err);
			throw GAME_DOESNT_EXISTS();
		}
		this.logger.log(
			`${client.data["username"]} joined the match between ${game.p1.name} vs ${game.p2.name}`,
		);

		if (game.readyToBegin) {
			game.p1.socket.join(game.token);
			game.p2.socket.join(game.token);

			this.logger.log(`Everyone is here. Ready to begin.`);

			if (game.isWaiting) {
				this.logger.log(`Player reconnected finally`);
				game.stopWaitConnect();
				this.server.to(game.token).emit(PLAYER_RECONNECT, game.lastUpdateData);
			} else {
				this.logger.log(`${game.p1.name} vs ${game.p2.name} match initialization`);
				this.server.to(game.token).emit(MATCH_INIT, {
					leftPlayer: { name: game.p1.name, avatar: game.p1.avatar },
					rightPlayer: { name: game.p2.name, avatar: game.p2.avatar },
					ballDirection: game.generateRandomBallDirection(),
				});

				if (await this.checkFirstBlood(game.p1.name)) {
					game.p1.socket.emit(ACHIEVEMENT_EARNED, { type: AchievementType.firstBlood });
				}
				if (await this.checkFirstBlood(game.p2.name)) {
					game.p2.socket.emit(ACHIEVEMENT_EARNED, { type: AchievementType.firstBlood });
				}
			}
			await this.activityService.setActivity(game.p1.name, "ingame");
			await this.activityService.setActivity(game.p2.name, "ingame");
		}
	}

	@UsePipes(new ValidationPipe())
	@UseFilters(new SocketExceptionFilter())
	@SubscribeMessage(PLAYER_MOVE)
	async gameUpdate(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: PlayerMovedDTO,
	) {
		const game = this.gameService.getGame(client.data["token"])!;
		if (!game || game.isWaiting || game.isOver) {
			return;
		}

		game.lastUpdateData = data.gameData;
		this.server.to(client.data["token"]).emit(PLAYER_MOVED, data.gameData);
	}

	@UsePipes(new ValidationPipe())
	@SubscribeMessage(BALL_UPDATE)
	@UseFilters(new SocketExceptionFilter())
	async ballUpdate(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: BallUpdateDTO,
	) {
		const game = this.gameService.getGame(client.data["token"])!;
		if (!game || game.isWaiting || game.isOver) {
			return;
		}

		const scored = game.calculateBallPosition(data.gameData);
		if (scored) {
			const winner = game.getWinner(data.gameData);
			const loser = game.getLoser(data.gameData);

			if (winner && loser) {
				this.server.to(client.data["token"]).emit(MATCH_OVER, {
					gameData: data.gameData,
					winner,
					loser,
				});
				game.isOver = true;
				await this.activityService.setActivity(game.p1.name, "online");
				await this.activityService.setActivity(game.p2.name, "online");
				await this.gameService.finishGame(game.token, winner, loser);
			} else {
				this.server.to(client.data["token"]).emit(PLAYER_SCORED, data.gameData);
			}
		} else {
			this.server.to(client.data["token"]).emit(BALL_UPDATE, data.gameData);
		}
		game.lastUpdateData = data.gameData;
	}
}
