import { IsOptional, IsString } from "class-validator";

export class GetProfileDTO {
	@IsString()
	@IsOptional()
	public username?: string;
}
