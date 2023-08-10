import { IsString } from 'class-validator';

export class MessageDTO {
	@IsString()
	public ownerName: string;

	@IsString()
	public content: string;
}
