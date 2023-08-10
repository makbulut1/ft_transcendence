import { IsString } from "class-validator";

export class ChannelBanDTO {
	@IsString()
	public channelName: string;

	@IsString()
	public username: string;
}
