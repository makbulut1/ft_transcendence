import { GameDataDTO } from "@/modules/game/dto/GameData.dto";
import { Type } from "class-transformer";
import { IsObject, ValidateNested } from "class-validator";

export class BallUpdateDTO {
	@IsObject()
	@ValidateNested()
	@Type(() => GameDataDTO)
	gameData: GameDataDTO;
}
