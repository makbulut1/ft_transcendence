export interface JwtUser /* extends User */ {
	username: string;
	avatar: string;
	token?: string;
	twoFactorAuthEnabled?: boolean;
}
