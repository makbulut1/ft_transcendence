import { IsOptional, IsString } from "class-validator";

export class ChannelJoinDTO {
	@IsString()
	public channelName: string;

	@IsOptional()
	@IsString()
	public password?: string;
}
