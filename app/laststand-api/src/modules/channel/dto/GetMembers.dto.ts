import { IsString } from "class-validator";

export class GetMembersDTO {
	@IsString()
	public channelName: string;

	@IsString()
	public memberName: string;
}
