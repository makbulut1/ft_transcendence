import { IsEnum, IsString } from 'class-validator';

export class ConversationDTO {
	@IsString()
	public name: string;

	@IsString()
	@IsEnum(['private', 'channel'])
	public type: 'private' | 'channel';
}
