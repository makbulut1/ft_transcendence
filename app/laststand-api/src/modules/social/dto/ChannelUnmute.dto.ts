import { IsNumber, IsString } from "class-validator";

export class ChannelUnmuteDTO {
	@IsString()
	public channelName: string;

	@IsString()
	public username: string;
}
