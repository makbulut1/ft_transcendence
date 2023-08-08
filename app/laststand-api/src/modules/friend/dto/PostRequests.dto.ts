import { IsEnum, IsString } from 'class-validator';

export class PostRequestDTO {
	@IsString()
	public username: string;

	@IsString()
	public friendName: string;

	@IsString()
	@IsEnum(['request', 'approve', 'deny', 'cancel'])
	public operation: 'request' | 'approve' | 'deny' | 'cancel';
}
