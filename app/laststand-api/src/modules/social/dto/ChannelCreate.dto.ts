import { ChannelDTO } from "@/dto/Channel.dto";
import { Type } from "class-transformer";
import { IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

export class ChannelCreateDTO {
	@IsOptional()
	@IsString()
	public password?: string;

	@IsObject()
	@ValidateNested()
	@Type(() => ChannelDTO)
	public channel: ChannelDTO;
}
