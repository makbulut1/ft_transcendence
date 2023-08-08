import { IsString } from "class-validator";

export class ChannelUnblockDTO {
	@IsString()
	public channelName: string;

	@IsString()
	public username: string;
}
