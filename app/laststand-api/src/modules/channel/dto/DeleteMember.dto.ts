import { IsString } from 'class-validator';

export class DeleteMemberDTO {
	@IsString()
	public username: string;

	@IsString()
	public by: string;

	@IsString()
	public channelName: string;
}
