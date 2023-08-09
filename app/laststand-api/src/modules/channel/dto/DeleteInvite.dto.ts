import { IsString } from "class-validator";

export class DeleteInviteDTO {
	@IsString()
	public username: string;

	@IsString()
	public channelName: string;
}
