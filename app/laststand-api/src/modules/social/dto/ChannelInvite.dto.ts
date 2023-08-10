import { IsString } from "class-validator";

export class ChannelInviteDTO {
	@IsString()
	public channelName: string;

	@IsString()
	public username: string;
}
