import { Authorization } from "@/decorators/auth.decorator";
import { ChatService } from "@/modules/chat/chat.service";
import { GetConversationListDTO } from "@/modules/chat/dto/GetConversationList.dto";
import { Controller, Get, Query } from "@nestjs/common";
import { JwtUser } from "@shared/models";

@Controller("chat")
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get("conversations")
	async getConversations(@Query() query: GetConversationListDTO, @Authorization() auth: JwtUser) {
		if (!query.conversation) {
			return await this.chatService.getConversationList(auth.username);
		} else {
			return await this.chatService.getChat(
				auth.username,
				query.conversation,
				query.fillMessages,
			);
		}
	}
}
