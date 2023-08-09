import { IsString } from "class-validator";

export class AcceptMatchDTO {
	@IsString()
	public username: string;
}
