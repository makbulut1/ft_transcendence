import { VectorDTO } from "@/modules/game/dto/Vector.dto";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";

export class BallDTO {
	@IsObject()
	@ValidateNested()
	@Type(() => VectorDTO)
	direction: VectorDTO;

	@IsNumber()
	speed: number;

	@IsNumber()
	radius: number;

	@IsNumber()
	velocity: number;

	@IsObject()
	@ValidateNested()
	@Type(() => VectorDTO)
	position: VectorDTO;
}
