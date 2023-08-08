import { IsOptional, IsString } from "class-validator";

export class GetLoginDTO {
	@IsString()
	public code: string;

	@IsString()
	@IsOptional()
	public authCode?: string;
}
