import { Size } from "./size.interface";
import { Player } from "./player.interface";
import { Ball } from "./ball.interface";

export interface GameData {
	canvasSize: Size;
	paddleSize: Size;
	leftPlayer: Player;
	rightPlayer: Player;
	ball: Ball;
	targetScore: number;
	deltaTime: number;
}
