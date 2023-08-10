import { Type } from 'class-transformer';
import {
	IsEnum,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

class ChannelDTO {
	@IsString()
	public name: string;

	@IsString()
	@IsEnum(['public', 'protected', 'private'])
	public type: 'public' | 'protected' | 'private';
}

export class PostChannelsDTO {
	@IsString()
	public username: string;

	@IsOptional()
	@IsString()
	public password?: string;

	@IsObject()
	@ValidateNested()
	@Type(() => ChannelDTO)
	public channel: ChannelDTO;
}
