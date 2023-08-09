import { GameDataDTO } from "@/modules/game/dto/GameData.dto";
import { Type } from "class-transformer";
import { IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

export class JoinMatchDTO {
	@IsString()
	public token: string;

	@IsObject()
	@ValidateNested()
	@Type(() => GameDataDTO)
	gameData: GameDataDTO;
}
