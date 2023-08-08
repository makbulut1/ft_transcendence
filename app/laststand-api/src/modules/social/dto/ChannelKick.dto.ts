import { IsString } from "class-validator";

export class ChannelKickDTO {
	@IsString()
	public channelName: string;

	@IsString()
	public username: string;
}
