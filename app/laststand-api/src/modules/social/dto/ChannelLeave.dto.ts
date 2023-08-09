import { IsString } from "class-validator";

export class ChannelLeaveDTO {
	@IsString()
	public channelName: string;
}
