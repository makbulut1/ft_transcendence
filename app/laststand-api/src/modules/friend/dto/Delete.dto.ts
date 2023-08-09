import { IsString } from 'class-validator';

export class DeleteDTO {
	@IsString()
	public username: string;

	@IsString()
	public friendName: string;
}
