import { ConversationDTO } from "@/dto/Conversation.dto";
import { MessageDTO } from "@/dto/Message.dto";
import { Type } from "class-transformer";
import { IsObject, ValidateNested } from "class-validator";

export class SendMessageDTO {
	@IsObject()
	@ValidateNested()
	@Type(() => ConversationDTO)
	public conversation: ConversationDTO;

	@IsObject()
	@ValidateNested()
	@Type(() => MessageDTO)
	public message: MessageDTO;
}
