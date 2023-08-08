import { IsOptional, IsString } from 'class-validator';

export class PostMyChannelsDTO {
	@IsString()
	public username: string;

	@IsString()
	public channelName: string;

	@IsOptional()
	@IsString()
	public password?: string;
}
