import { useAuthStore } from "@/stores/useAuthStore";
import {
	ACHIEVEMENT_EARNED,
	BALL_UPDATE,
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
import { GameData, Player, Size, Vector } from "@shared/types";
import { useEffect, useRef, useState } from "react";
import { clamp } from "@shared/utils/clamp";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGameSocket, useSocialSocket } from "@/hooks/useSocket";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { AchievementType } from "@shared/models";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { DEFAULT_BALL_SPEED, TARGET_SCORE } from "@shared/constants/game";

type State = "waiting" | "play" | "win" | "lose";

export function useViewModel() {
	const [leftPlayerInfo, setLeftPlayerInfo] = useState<Player>();
	const [rightPlayerInfo, setRightPlayerInfo] = useState<Player>();
	const [state, setState] = useState<State>("waiting");
	const [params] = useSearchParams();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const moveSpeed = 5;
	const game = useGameSocket();
	const auth = useAuthStore();
	const token = params.get("token");
	const navigate = useNavigate();
	const canvas: Size = {
		h: 400,
		w: 700,
	};
	const paddleSize: Size = {
		h: 80,
		w: 10,
	};
	let gameData: GameData = {
		ball: {
			direction: { x: 0, y: 0 },
			position: { x: canvas.w / 2, y: canvas.h / 2 },
			radius: 5,
			speed: DEFAULT_BALL_SPEED,
			velocity: 0,
		},
		leftPlayer: {
			name: "",
			avatar: "",
			score: 0,
			position: { x: 3, y: canvas.h / 2 - paddleSize.h / 2 },
		},
		rightPlayer: {
			name: "",
			avatar: "",
			score: 0,
			position: { x: canvas.w - paddleSize.w, y: canvas.h / 2 - paddleSize.h / 2 },
		},
		paddleSize,
		targetScore: TARGET_SCORE,
		canvasSize: canvas,
		deltaTime: 1,
	};
	let countdownTexts: undefined | string | string[] = undefined;
	let countdownValue = 0;
	let countDownInterval: number;
	let pressingKey: string | undefined = "";
	let isPlaying = false;
	let frameId = 0;

	let fps = 60;
	let start = Date.now();
	let frameDuration = 1000 / fps + 1;
	let lag = 0;

	useSocialSocket();

	// Functions
	function joinMatch() {
		game.connect();
		game.emit(JOIN_MATCH, { token, gameData });
	}

	// Game functions
	function requestFrame() {
		frameId = window.requestAnimationFrame(gameLoop);
	}
	function getMainPlayer() {
		if (auth.username == gameData?.leftPlayer.name) {
			return gameData?.leftPlayer!;
		} else {
			return gameData?.rightPlayer!;
		}
	}
	function updateMainPlayer(fields: Partial<Player>) {
		if (auth.username == gameData?.leftPlayer.name) {
			gameData!.leftPlayer = { ...gameData?.leftPlayer!, ...fields };
		} else {
			gameData!.rightPlayer = { ...gameData?.rightPlayer!, ...fields };
		}
	}
	function checkPlayerMovement(moveUpKeys: string[], moveDownKeys: string[]) {
		const isMovingUp = moveUpKeys.find((x) => x == pressingKey);
		const isMovingDown = moveDownKeys.find((x) => x == pressingKey);
		let mp = getMainPlayer();

		if (isMovingUp) {
			updateMainPlayer({
				position: {
					x: mp.position!.x,
					y: mp.position!.y - moveSpeed * gameData.deltaTime,
				},
			});
		} else if (isMovingDown) {
			updateMainPlayer({
				position: {
					x: mp.position!.x,
					y: mp.position!.y + moveSpeed * gameData.deltaTime,
				},
			});
		}

		mp = getMainPlayer();
		updateMainPlayer({
			position: {
				x: mp.position!.x,
				y: clamp(mp.position!.y, gameData.canvasSize.h - gameData!.paddleSize.h, 0),
			},
		});

		if (isMovingDown || isMovingUp) {
			game.emit(PLAYER_MOVE, {
				gameData,
			});
		}
	}
	function startCountdown() {
		setLeftPlayerInfo(gameData.leftPlayer);
		setRightPlayerInfo(gameData.rightPlayer);
		countdown(3, () => {
			isPlaying = true;
		});
	}
	function clearCanvas() {
		const ctx = canvasRef.current?.getContext("2d");
		if (!ctx) {
			return;
		}

		ctx.clearRect(0, 0, gameData.canvasSize.w, gameData.canvasSize.h);
	}
	function countdown(count: number, onComplete?: () => void, texts?: string | string[]) {
		clearInterval(countDownInterval);

		countdownTexts = texts;
		countdownValue = count;
		countDownInterval = setInterval(() => {
			if (countdownValue == 0) {
				clearInterval(countDownInterval);
				onComplete?.();
				return;
			}
			countdownValue--;
		}, 1000);
	}
	/* 	function stopCountdown() {
		clearInterval(countDownInterval);
		countdownValue = 0;
	} */
	function renderBall(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.arc(
			gameData!.ball.position.x,
			gameData!.ball.position.y,
			gameData!.ball.radius,
			0,
			2 * Math.PI,
		);
		if (localStorage.getItem("map") == "neverland") {
			ctx.fillStyle = "white";
			ctx.strokeStyle = "white";
		} else {
			ctx.fillStyle = "black";
			ctx.strokeStyle = "black";
		}
		ctx.fill();
		ctx.lineWidth = 1.1;
		ctx.stroke();
		ctx.closePath();
	}
	function renderCountdown(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.font = "bold 60px None";

		if (localStorage.getItem("map") == "neverland") {
			ctx.fillStyle = "white";
		} else {
			ctx.fillStyle = "black";
		}

		ctx.textAlign = "center";
		ctx.fillText(
			countdownValue.toString(),
			gameData.canvasSize.w / 2,
			gameData.canvasSize.h / 2,
		);
		ctx.closePath();

		function drawText(txt: string) {
			ctx.beginPath();
			ctx.font = "bold 20px None";
			if (localStorage.getItem("map") == "neverland") {
				ctx.fillStyle = "white";
			} else {
				ctx.fillStyle = "black";
			}
			ctx.textAlign = "center";
			ctx.fillText(txt, gameData.canvasSize.w / 2, gameData.canvasSize.h / 2 + 60);
			ctx.closePath();
		}
		if (countdownTexts) {
			if (Array.isArray(countdownTexts)) {
				const text = countdownTexts[countdownValue - 1];
				if (text) {
					drawText(text);
				}
			} else {
				drawText(countdownTexts);
			}
		}
	}
	function renderPlayer(ctx: CanvasRenderingContext2D, player: Player) {
		ctx.beginPath();
		ctx.rect(
			player.position!.x,
			player.position!.y,
			gameData!.paddleSize.w,
			gameData!.paddleSize.h,
		);
		if (localStorage.getItem("map") == "neverland") {
			ctx.fillStyle = "white";
			ctx.strokeStyle = "white";
		} else {
			ctx.fillStyle = "black";
			ctx.strokeStyle = "black";
		}
		ctx.fill();
		ctx.lineWidth = 1.2;
		ctx.stroke();
		ctx.closePath();
	}
	function gameRender() {
		const ctx = canvasRef.current?.getContext("2d");
		if (!ctx) {
			return;
		}
		ctx.beginPath();
		ctx.rect(0, 0, gameData.canvasSize.w, gameData.canvasSize.h);
		if (localStorage.getItem("map") == "neverland") {
			ctx.fillStyle = "#000";
		} else {
			ctx.fillStyle = "#fffb";
		}
		ctx.fill();
		ctx.strokeStyle = "white";
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.closePath();

		if (countdownValue > 0) {
			renderCountdown(ctx);
		}

		renderBall(ctx);
		renderPlayer(ctx, gameData!.leftPlayer);
		renderPlayer(ctx, gameData!.rightPlayer);
	}
	function gameLogic() {
		if (!isPlaying) {
			return;
		}

		checkPlayerMovement(["ArrowUp", "W", "w"], ["ArrowDown", "S", "s"]);
		game.emit(BALL_UPDATE, { gameData });
	}
	function gameLoop() {
		requestFrame();

		var current = Date.now(),
			elapsed = current - start;
		start = current;
		lag += elapsed;

		while (lag >= frameDuration) {
			gameData.deltaTime = lag / frameDuration;
			clearCanvas();
			gameLogic();
			gameRender();
			lag -= frameDuration;
		}
	}
	function onKeyDown(key: string) {
		pressingKey = key;
	}
	function onKeyUp(key: string) {
		if (key == pressingKey) {
			pressingKey = undefined;
		}
	}

	// Socket events
	function matchInit(data: { leftPlayer: Player; rightPlayer: Player; ballDirection: Vector }) {
		setState("play");
		setLeftPlayerInfo(data.leftPlayer);
		setRightPlayerInfo(data.rightPlayer);
		gameData.leftPlayer = { ...gameData.leftPlayer, ...data.leftPlayer };
		gameData.rightPlayer = { ...gameData.rightPlayer, ...data.rightPlayer };
		gameData.ball.direction = data.ballDirection;
		startCountdown();
	}
	function playerMoved(data: GameData) {
		gameData = data;
	}
	function ballUpdate(data: GameData) {
		gameData.ball = data.ball;
	}
	function playerScored(data: GameData) {
		isPlaying = false;
		gameData = data;
		startCountdown();
	}
	function playerDrop() {
		isPlaying = false;
		countdown(
			30,
			() => {
				matchCancel();
			},
			"Waiting for other player...",
		);
	}
	function playerReconnect(data: GameData) {
		setState("play");
		gameData = data;
		setLeftPlayerInfo(data.leftPlayer);
		setRightPlayerInfo(data.rightPlayer);
		startCountdown();
	}
	function matchOver(data: { gameData: GameData; winner: Player; loser: Player }) {
		gameData = data.gameData;
		if (data.winner.name == auth.username) {
			setState("win");
		} else if (data.loser.name == auth.username) {
			setState("lose");
		}
		window.cancelAnimationFrame(frameId);
		isPlaying = false;
	}
	function matchCancel() {
		navigate("/", { replace: true });
	}
	function wentWrong(/* data: { error: LSError } */) {
		navigate("/", { replace: true });
	}
	function disconnect() {
		navigate("/", { replace: true });
	}
	function achievementEarned(data: { type: AchievementType }) {
		toast.info(
			<div className="flex justify-between w-full items-center">
				<div>
					You earned an achievement:{" "}
					{data.type.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
						return str.toUpperCase();
					})}
				</div>
			</div>,
			{
				icon: () => <Icon fontSize={40} icon="dashicons:awards" />,
			},
		);
	}

	useSocketEvent(game, MATCH_INIT, matchInit);
	useSocketEvent(game, MATCH_CANCEL, matchCancel);
	useSocketEvent(game, MATCH_OVER, matchOver, [auth]);
	useSocketEvent(game, PLAYER_MOVED, playerMoved);
	useSocketEvent(game, PLAYER_DROP, playerDrop);
	useSocketEvent(game, PLAYER_RECONNECT, playerReconnect);
	useSocketEvent(game, PLAYER_SCORED, playerScored);
	useSocketEvent(game, BALL_UPDATE, ballUpdate);
	useSocketEvent(game, WENT_WRONG, wentWrong);
	useSocketEvent(game, ACHIEVEMENT_EARNED, achievementEarned);
	useSocketEvent(game, "disconnect", disconnect);

	useEffect(() => {
		joinMatch();

		const keyDownEvent = (e: any) => onKeyDown(e.key);
		const keyUpEvent = (e: any) => onKeyUp(e.key);
		requestFrame();
		document.addEventListener("keydown", keyDownEvent);
		document.addEventListener("keyup", keyUpEvent);
		return () => {
			document.removeEventListener("keydown", keyDownEvent);
			document.removeEventListener("keyup", keyUpEvent);
			window.cancelAnimationFrame(frameId);
			game.disconnect();
		};
	}, []);

	return {
		canvasRef,
		gameData,
		state,
		leftPlayerInfo,
		rightPlayerInfo,
		token,
	};
}
