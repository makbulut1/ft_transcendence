import { Authorization } from "@/decorators/auth.decorator";
import { AuthService } from "@/modules/auth/auth.service";
import { GetLoginDTO } from "@/modules/auth/dto/GetLogin.dto";
import { UserService } from "@/modules/user/user.service";
import { Controller, Get, HttpException, HttpStatus, Logger, Query } from "@nestjs/common";
import { JwtUser } from "@shared/models";
import { authenticator } from "otplib";
import QRCode from "qrcode";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@Get("qrcode")
	async get2FaQrCode(@Authorization() auth: JwtUser) {
		try {
			const secret = await this.userService.get2FaSecret(auth.username);
			const otpAuthUrl = authenticator.keyuri(auth.username, "laststand", secret);
			return QRCode.toDataURL(otpAuthUrl);
		} catch (err) {
			Logger.error(err);
			throw new HttpException(err, HttpStatus.NOT_FOUND);
		}
	}

	@Get()
	async getLogin(@Query() query: GetLoginDTO) {
		try {
			return await this.authService.login(query.code, query.authCode);
		} catch (err) {
			throw new HttpException(err, HttpStatus.UNAUTHORIZED);
		}
	}

	@Get("me")
	async getMe(@Authorization() auth: JwtUser) {
		try {
			return await this.userService.getUser(auth.username);
		} catch (err) {
			Logger.error(err);
			throw new HttpException(err, HttpStatus.NOT_FOUND);
		}
	}
}
