import jwt from "jsonwebtoken";
import axios from "axios";
import { AUTH_ERROR, WRONG_2FA_CODE } from "@/error/errors";
import { Injectable, Logger } from "@nestjs/common";
import { UserService } from "@/modules/user/user.service";
import { JwtUser } from "@shared/models";
import { authenticator } from "otplib";
import { DatabaseService } from "@/modules/database/database.service";

@Injectable()
export class AuthService {
	private exchangedCodes = new Map<string, string>();
	private readonly logger = new Logger("AUTH");
	private client = axios.create({
		baseURL: "https://api.intra.42.fr",
	});

	constructor(
		private readonly userService: UserService,
		private readonly databaseService: DatabaseService,
	) {}

	async login(code: string, twoFactorAuthCode?: string): Promise<[JwtUser, boolean]> {
		const token = await this.exchangeCodeWithToken(code);
		const intraUser = await this.getIntraUser(token);
		const [user, newUser] = await this.userService.getOrCreateUser(
			intraUser.name,
			intraUser.avatar,
			intraUser.id,
		);
		const jwtUser: JwtUser = {
			username: user.name,
			avatar: user.avatar,
			token: jwt.sign({ username: user.name }, process.env.JWT_SECRET),
		};

		const twoFactorAuthSecret = await this.userService.get2FaSecret(user.name);
		if (twoFactorAuthSecret) {
			if (twoFactorAuthCode) {
				const codeVerified = authenticator.verify({
					token: twoFactorAuthCode,
					secret: twoFactorAuthSecret,
				});

				if (!codeVerified) {
					this.logger.error(
						`Code ${twoFactorAuthCode} invalid for user ${jwtUser.username}`,
					);
					throw WRONG_2FA_CODE();
				}
				return [jwtUser, newUser];
			}

			return [
				{
					username: jwtUser.username,
					avatar: jwtUser.avatar,
					twoFactorAuthEnabled: true,
				},
				newUser,
			];
		}

		return [jwtUser, newUser];
	}

	async getIntraUser(token: string) {
		try {
			const response = await this.client.get("/v2/me", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return {
				id: `${response.data.id}`,
				name: response.data.login,
				avatar: response.data.image.link,
			};
		} catch (err) {
			if (err?.response) {
				this.logger.error(err?.response?.data?.error_description);
			} else {
				this.logger.error(err);
			}
			throw AUTH_ERROR();
		}
	}

	validateJWT(token: string): JwtUser {
		try {
			return jwt.verify(token, process.env.JWT_SECRET) as JwtUser;
		} catch (err) {
			throw AUTH_ERROR();
		}
	}

	async exchangeCodeWithToken(code: string): Promise<string | undefined> {
		const exchangedToken = this.exchangedCodes[code];
		if (exchangedToken) {
			return exchangedToken;
		}

		try {
			const response = await this.client.post("/oauth/token", {
				grant_type: "authorization_code",
				client_id: process.env.INTRA_UID,
				client_secret: process.env.INTRA_SECRET,
				redirect_uri: process.env.INTRA_REDIRECT,
				code,
			});
			this.exchangedCodes[code] = response.data.access_token;

			return response.data.access_token;
		} catch (err) {
			if (err?.response) {
				this.logger.error(err?.response?.data?.error_description);
			} else {
				this.logger.error(err);
			}
			throw AUTH_ERROR();
		}
	}

	private get prisma() {
		return this.databaseService.prisma;
	}
}
