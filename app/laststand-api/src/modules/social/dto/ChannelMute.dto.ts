import { IsNumber, IsString } from "class-validator";

export class ChannelMuteDTO {
	@IsString()
	public channelName: string;

	@IsString()
	public username: string;

	@IsNumber()
	public minute: number;
}
