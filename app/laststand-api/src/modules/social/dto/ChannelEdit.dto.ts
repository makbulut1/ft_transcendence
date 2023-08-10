import { IsEnum, IsOptional, IsString } from "class-validator";

export class ChannelEditDTO {
	@IsString()
	public channelName: string;

	@IsString()
	@IsEnum(["public", "private", "protected"])
	public type: "public" | "private" | "protected";

	@IsOptional()
	@IsString()
	public password?: string;
}
