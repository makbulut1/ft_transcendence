import { IsString } from "class-validator";

export class BlockUserDTO {
	@IsString()
	public username: string;
}
