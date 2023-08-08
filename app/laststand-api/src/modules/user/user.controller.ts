import { Authorization } from "@/decorators/auth.decorator";
import { ActivityService } from "@/modules/activity/activity.service";
import { GetProfileDTO } from "@/modules/user/dto/GetProfile.dto";
import { UserService } from "@/modules/user/user.service";
import {
	Controller,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Logger,
	Query,
} from "@nestjs/common";
import { ERR_AN_ERROR_OCCURRED, ERR_USER_DOESNT_EXISTS } from "@shared/errorCodes";
import { JwtUser } from "@shared/models";

@Controller("users")
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly activityService: ActivityService,
	) {}

	@Get()
	async getUsers(@Authorization() auth: JwtUser) {
		const users = await this.userService.getUsersWithFriends(auth.username);

		for (const user of users) {
			if (user.isFriend) {
				user.status = await this.activityService.getActivity(user.name);
			}
		}

		return users;
	}

	@Get("profile")
	async getProfile(@Authorization() auth: JwtUser, @Query() query: GetProfileDTO) {
		try {
			const profile = await this.userService.getProfile(
				auth.username,
				query.username ?? auth.username,
			);
			if (profile.isFriend) {
				profile.status = await this.activityService.getActivity(profile.name);
			}
			return profile;
		} catch (err) {
			throw new HttpException(err, HttpStatus.NOT_FOUND);
		}
	}

	@Get("blocked")
	async getBlockedUsers(@Authorization() auth: JwtUser) {
		try {
			return await this.userService.getBlockedUsers(auth.username);
		} catch (err) {
			throw new HttpException(err, HttpStatus.NOT_FOUND);
		}
	}
}
