import { IsString } from 'class-validator';

export class DeleteChannelsDTO {
	@IsString()
	public channelName: string;

	@IsString()
	public username: string;
}
