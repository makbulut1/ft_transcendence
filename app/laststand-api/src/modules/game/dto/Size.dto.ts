import { IsNumber } from "class-validator";

export class SizeDTO {
	@IsNumber()
	w: number;

	@IsNumber()
	h: number;
}
