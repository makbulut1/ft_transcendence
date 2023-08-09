import { Room } from "@/classes/Room";
import { GameData, Player, Vector } from "@shared/types";
import { BALL_ACCELERATION_RATE, DEFAULT_BALL_SPEED } from "@shared/constants/game";

export class GameRoom extends Room {
	public secret: string;
	public token: string;
	public isWaiting: boolean = false;
	public isOver: boolean = false;
	public lastUpdateData: GameData = undefined;

	private interval: NodeJS.Timer;
	private maxWaitSecond = 30;
	private waitSecond = 0;

	constructor(secret: string, token: string) {
		super();
		this.secret = secret;
		this.token = token;
	}

	get readyToBegin(): boolean {
		return !!this.p1?.socket && !!this.p2?.socket;
	}

	get p1Data(): Player {
		const p1Data = { ...this.p1 };

		delete p1Data.socket;
		return p1Data;
	}
	get p2Data(): Player {
		const p2Data = { ...this.p2 };

		delete p2Data.socket;
		return p2Data;
	}

	getWinner(data: GameData): Player | undefined {
		if (data.leftPlayer.score == data.targetScore) {
			return data.leftPlayer;
		} else if (data.rightPlayer.score == data.targetScore) {
			return data.rightPlayer;
		}
	}

	getLoser(data: GameData): Player | undefined {
		// https://youtu.be/0gqcQdN6N-k?t=30
		const winner = this.getWinner(data);
		if (!winner) {
			return;
		}

		if (winner.name == data.leftPlayer.name) {
			return data.rightPlayer;
		} else if (winner.name == data.rightPlayer.name) {
			return data.leftPlayer;
		}
	}

	startWaitConnect(onFailed: () => void) {
		this.waitSecond = this.maxWaitSecond;
		this.isWaiting = true;
		this.interval = setInterval(() => {
			if (this.readyToBegin) {
				this.stopWaitConnect();
				return;
			}
			if (this.waitSecond-- == 0) {
				this.stopWaitConnect();
				onFailed();
			}
		}, 1000);
	}

	stopWaitConnect() {
		this.isWaiting = false;
		clearInterval(this.interval);
	}

	generateRandomBallDirection(): Vector {
		const ballDirection: Vector = { x: 0, y: 0 };

		while (Math.abs(ballDirection.x) <= 0.2 || Math.abs(ballDirection.x) >= 0.9) {
			ballDirection.x = Math.random() * 2 - 1; // Random value between -1 and 1 for x
			ballDirection.y = Math.random() * 2 - 1; // Random value between -1 and 1 for y
		}

		// Normalize the direction vector
		const magnitude = Math.sqrt(
			ballDirection.x * ballDirection.x + ballDirection.y * ballDirection.y,
		);
		ballDirection.x /= magnitude;
		ballDirection.y /= magnitude;

		return ballDirection;
	}

	checkPlayerCollision(data: GameData, player: Player) {
		return (
			data.ball.position.x + data.ball.radius >= player.position.x &&
			data.ball.position.x - data.ball.radius <= player.position.x + data.paddleSize.w &&
			data.ball.position.y + data.ball.radius >= player.position.y &&
			data.ball.position.y - data.ball.radius <= player.position.y + data.paddleSize.h
		);
	}

	resetPaddles(data: GameData) {
		data.rightPlayer.position = {
			x: data.canvasSize.w - data.paddleSize.w,
			y: data.canvasSize.h / 2 - data.paddleSize.h / 2,
		};
		data.leftPlayer.position = {
			x: 3,
			y: data.canvasSize.h / 2 - data.paddleSize.h / 2,
		};
	}

	resetBall(data: GameData) {
		data.ball.direction = this.generateRandomBallDirection();
		data.ball.speed = DEFAULT_BALL_SPEED;
		data.ball.position = {
			x: data.canvasSize.w / 2,
			y: data.canvasSize.h / 2,
		};
	}

	checkBallCollision(data: GameData): boolean {
		if (
			data.ball.position.y - data.ball.radius < 0 ||
			data.ball.position.y + data.ball.radius > data.canvasSize.h
		) {
			data.ball.direction.y *= -1;
		}
		if (
			this.checkPlayerCollision(data, data.leftPlayer) ||
			this.checkPlayerCollision(data, data.rightPlayer)
		) {
			data.ball.direction.x *= -1;
			data.ball.speed +=
				BALL_ACCELERATION_RATE *
				Math.round(Math.sqrt(data.ball.speed / DEFAULT_BALL_SPEED)) *
				data.deltaTime;
		}

		const leftCollision = data.ball.position.x - data.ball.radius < 0;
		const rightCollision = data.ball.position.x + data.ball.radius > data.canvasSize.w;

		if (leftCollision || rightCollision) {
			this.resetBall(data);
			this.resetPaddles(data);

			if (leftCollision) {
				data.rightPlayer.score++;
			} else {
				data.leftPlayer.score++;
			}
			return true;
		}
		return false;
	}

	calculateBallPosition(data: GameData) {
		data.ball.velocity = 0.125 * data.ball.speed;
		data.ball.position.x += data.ball.direction.x * data.ball.velocity;
		data.ball.position.y += data.ball.direction.y * data.ball.velocity;
		return this.checkBallCollision(data);
	}
}
