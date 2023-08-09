import { IsString } from "class-validator";

export class FriendRemoveDTO {
	@IsString()
	public friendName: string;
}
