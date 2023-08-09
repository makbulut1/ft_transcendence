import { IsString } from "class-validator";

export class FriendRequestDTO {
	@IsString()
	public friendName: string;
}
