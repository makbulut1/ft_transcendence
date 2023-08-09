import { IsString } from 'class-validator';

export class GetChannelDTO {
	@IsString()
	public name: string;
}
