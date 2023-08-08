import { IsEnum, IsString } from "class-validator";

export class ChannelDTO {
	@IsString()
	public name: string;

	@IsString()
	@IsEnum(["public", "private", "protected"])
	public type: "public" | "private" | "protected";
}
