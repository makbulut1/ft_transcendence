import { ConversationDTO } from '@/dto/Conversation.dto';
import { Type } from 'class-transformer';
import { IsObject, IsString, ValidateNested } from 'class-validator';

export class GetDTO {
	@IsString()
	public username: string;

	@IsObject()
	@ValidateNested()
	@Type(() => ConversationDTO)
	public conversation: ConversationDTO;
}
