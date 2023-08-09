import { IsString } from "class-validator";

export class ChannelDeleteDTO {
	@IsString()
	public channelName: string;
}
