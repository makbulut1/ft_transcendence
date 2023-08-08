import { IsString } from "class-validator";

export class ChannelDenyDTO {
	@IsString()
	public channelName: string;
}
