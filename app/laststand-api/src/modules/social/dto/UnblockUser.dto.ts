import { IsString } from "class-validator";

export class UnblockUserDTO {
	@IsString()
	public username: string;
}
