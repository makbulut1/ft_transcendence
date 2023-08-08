import { IsString } from "class-validator";

export class PostInvitesDTO {
	@IsString()
	public username: string;

	@IsString()
	public invitedBy: string;

	@IsString()
	public channelName: string;
}
