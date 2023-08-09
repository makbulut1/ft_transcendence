import { SizeDTO } from "@/modules/game/dto/Size.dto";
import { VectorDTO } from "@/modules/game/dto/Vector.dto";
import { Type } from "class-transformer";
import { IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

export class PlayerDTO {
	@IsObject()
	@IsOptional()
	@ValidateNested()
	@Type(() => VectorDTO)
	position: VectorDTO;

	@IsString()
	name: string;

	@IsString()
	avatar: string;

	@IsNumber()
	score: number;
}
