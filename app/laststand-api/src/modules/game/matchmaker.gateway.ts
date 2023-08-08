import { Server, Socket } from "socket.io";
import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import {
	ACCEPT_MATCH,
	FIND_MATCH,
	MATCHMAKER_LOGGED,
	LOGIN,
	MATCH_FOUND,
	CANCEL_MATCH_SEARCH,
	MATCH_SEARCH_CANCELED,
} from "@shared/socketEvents";
import { LoginDTO } from "@/modules/game/dto/Login.dto";
import { AuthService } from "@/modules/auth/auth.service";
import { UserService } from "@/modules/user/user.service";
import { GameService } from "@/modules/game/game.service";
import { MatchMakerService } from "@/modules/game/matchmaker.service";
import { Player } from "@shared/types";
import { SocketExceptionFilter } from "@/filters/socketexception.filter";
import { SocketAuthGuard } from "@/guards/socketauth.guard";
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { ALREADY_WAITING } from "@/error/errors";
import { AcceptMatchDTO } from "@/modules/game/dto/AcceptMatch.dto";
import { GameRoom } from "@/classes/GameRoom";

@WebSocketGateway(+process.env.SOCKET_PORT, { namespace: "matchmaker", cors: true })
export class MatchMakerGateway implements OnGatewayDisconnect {
	private readonly logger = new Logger("MatchMaker-Socket");

	@WebSocketServer()
	private server: Server;

	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly gameService: GameService,
		private readonly matchMakerService: MatchMakerService,
	) {}

	handleDisconnect(@ConnectedSocket() client: Socket) {
		if (client.data["username"]) {
			this.matchMakerService.removeFromQueue(client.data["username"]);
		}
	}

	foundMatch(game: GameRoom) {
		this.server.to(game.p1.name).emit(MATCH_FOUND, {
			token: game.token,
			rival: {
				name: game.p2.name,
				avatar: game.p2.avatar,
			},
		});
		this.server.to(game.p2.name).emit(MATCH_FOUND, {
			token: game.token,
			rival: {
				name: game.p1.name,
				avatar: game.p1.avatar,
			},
		});
	}

	@UsePipes(new ValidationPipe())
	@UseFilters(new SocketExceptionFilter())
	@SubscribeMessage(LOGIN)
	async login(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: LoginDTO,
	) {
		// Already logged in
		if (client.data["username"]) {
			return;
		}
		const userInfo = this.authService.validateJWT(data.token);
		const user = await this.userService.getUser(userInfo.username);
		const sockets = await this.server.fetchSockets();
		const alreadyConnected = sockets.find((x) => x.data["username"] == userInfo.username);

		if (alreadyConnected) {
			throw ALREADY_WAITING(userInfo.username);
		}
		client.emit(MATCHMAKER_LOGGED);
		client.join(userInfo.username);
		client.data["username"] = userInfo.username;
		client.data["avatar"] = user.avatar;

		this.logger.log(`${userInfo.username} logged in`);
	}

	@UsePipes(new ValidationPipe())
	@UseFilters(new SocketExceptionFilter())
	@UseGuards(new SocketAuthGuard())
	@SubscribeMessage(ACCEPT_MATCH)
	async acceptMatch(@ConnectedSocket() client: Socket, @MessageBody() data: AcceptMatchDTO) {
		const rival = await this.userService.getUser(data.username);
		const game = this.gameService.createGame(
			{
				name: client.data["username"],
				avatar: client.data["avatar"],
			},
			{
				name: rival.name,
				avatar: rival.avatar,
			},
		);

		this.foundMatch(game);
	}

	@UseFilters(new SocketExceptionFilter())
	@UseGuards(new SocketAuthGuard())
	@SubscribeMessage(CANCEL_MATCH_SEARCH)
	async cancelMatchSearch(@ConnectedSocket() client: Socket) {
		this.matchMakerService.removeFromQueue(client.data["username"]);
		client.emit(MATCH_SEARCH_CANCELED);
	}

	@UseFilters(new SocketExceptionFilter())
	@UseGuards(new SocketAuthGuard())
	@SubscribeMessage(FIND_MATCH)
	async findMatch(@ConnectedSocket() client: Socket) {
		const username = client.data["username"];
		const profile = await this.userService.getProfile(username, username);
		const player: Player = {
			name: profile.name,
			avatar: profile.avatar,
		};

		this.matchMakerService.addToQueue(player);
		this.logger.log(`${player.name} searching for a game...`);

		const game = this.matchMakerService.getMatch(username);
		if (game) {
			this.foundMatch(game);
		}
	}
}
