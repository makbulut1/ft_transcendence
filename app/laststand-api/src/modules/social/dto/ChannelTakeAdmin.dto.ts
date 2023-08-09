import { IsString } from "class-validator";

export class ChannelTakeAdminDTO {
	@IsString()
	public channelName: string;

	@IsString()
	public username: string;
}
