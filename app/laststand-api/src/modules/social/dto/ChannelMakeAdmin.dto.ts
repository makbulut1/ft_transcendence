import { IsString } from "class-validator";

export class ChannelMakeAdminDTO {
	@IsString()
	public channelName: string;

	@IsString()
	public username: string;
}
