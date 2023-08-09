import { IsString } from "class-validator";

export class FriendDenyDTO {
	@IsString()
	public friendName: string;
}
