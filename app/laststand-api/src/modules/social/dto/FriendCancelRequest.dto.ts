import { IsString } from "class-validator";

export class FriendCancelRequest {
	@IsString()
	public friendName: string;
}
