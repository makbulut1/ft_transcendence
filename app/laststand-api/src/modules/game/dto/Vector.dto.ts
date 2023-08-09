import { IsNumber } from "class-validator";

export class VectorDTO {
	@IsNumber()
	x: number;

	@IsNumber()
	y: number;
}
