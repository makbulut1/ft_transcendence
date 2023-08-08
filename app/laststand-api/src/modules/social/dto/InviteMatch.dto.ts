import { IsString } from "class-validator";

export class InviteMatchDTO {
	@IsString()
	public username: string;
}
