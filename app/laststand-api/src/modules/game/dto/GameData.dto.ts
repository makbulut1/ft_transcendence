import { BallDTO } from "@/modules/game/dto/Ball.dto";
import { PlayerDTO } from "@/modules/game/dto/Player.dto";
import { SizeDTO } from "@/modules/game/dto/Size.dto";
import { Type } from "class-transformer";
import { IsNumber, IsObject, ValidateNested } from "class-validator";

export class GameDataDTO {
	@IsObject()
	@ValidateNested()
	@Type(() => SizeDTO)
	canvasSize: SizeDTO;

	@IsObject()
	@ValidateNested()
	@Type(() => SizeDTO)
	paddleSize: SizeDTO;

	@IsObject()
	@ValidateNested()
	@Type(() => PlayerDTO)
	leftPlayer: PlayerDTO;

	@IsObject()
	@ValidateNested()
	@Type(() => PlayerDTO)
	rightPlayer: PlayerDTO;

	@IsObject()
	@ValidateNested()
	@Type(() => BallDTO)
	ball: BallDTO;

	@IsNumber()
	targetScore: number;

	@IsNumber()
	deltaTime: number;
}
