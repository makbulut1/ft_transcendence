import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class EditUserDTO {
	@IsString()
	public name: string;

	@IsString()
	@IsOptional()
	public avatar?: string;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === "true")
	public twoFactorAuthEnabled: boolean;
}
