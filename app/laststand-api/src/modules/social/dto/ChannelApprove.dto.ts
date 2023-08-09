import { IsString } from "class-validator";

export class ChannelApproveDTO {
	@IsString()
	public channelName: string;
}
