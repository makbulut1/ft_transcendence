import { IsString } from "class-validator";

export class FriendApproveDTO {
	@IsString()
	public friendName: string;
}
