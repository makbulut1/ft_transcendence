import { IsOptional, IsString } from "class-validator";

export class GetStatusDTO {
	@IsString()
	@IsOptional()
	public friendName?: string;
}
