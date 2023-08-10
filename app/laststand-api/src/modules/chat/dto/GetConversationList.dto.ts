import { ConversationDTO } from "@/dto/Conversation.dto";
import { Transform, Type } from "class-transformer";
import {
	IsBoolean,
	IsBooleanString,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

export class GetConversationListDTO {
	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => ConversationDTO)
	public conversation?: ConversationDTO;

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === "true")
	public fillMessages?: boolean;
}
