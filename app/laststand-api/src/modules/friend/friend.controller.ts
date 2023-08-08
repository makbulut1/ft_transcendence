import { Controller, Get, Query } from "@nestjs/common";
import { FriendService } from "@/modules/friend/friend.service";
import { ActivityService } from "@/modules/activity/activity.service";
import { GetStatusDTO } from "@/modules/friend/dto/GetStatus.dto";
import { Authorization } from "@/decorators/auth.decorator";
import { JwtUser } from "@shared/models";

@Controller("friends")
export class FriendController {
	constructor(
		private readonly friendService: FriendService,
		private readonly activityService: ActivityService,
	) {}

	@Get()
	async getFriends(@Authorization() auth: JwtUser) {
		const friends = await this.friendService.getFriends(auth.username);

		for (const friend of friends) {
			const status = await this.activityService.getActivity(friend.name);
			friend.status = status ?? "offline";
		}

		return friends;
	}

	@Get("status")
	async getStatus(@Authorization() auth: JwtUser, @Query() query: GetStatusDTO) {
		if (!query.friendName) {
			return;
		}

		const isFriend = await this.friendService.hasFriendship(auth.username, query.friendName);
		if (isFriend) {
			const status = await this.activityService.getActivity(query.friendName);
			return status ?? "offline";
		}
	}

	@Get("possible")
	async getPossibleFriends(@Authorization() auth: JwtUser) {
		return await this.friendService.getPossibleFriends(auth.username);
	}

	@Get("requests/waiting")
	async getWaitingRequests(@Authorization() auth: JwtUser) {
		return await this.friendService.getWaitingRequests(auth.username);
	}

	@Get("requests/incoming")
	async getIncomingRequests(@Authorization() auth: JwtUser) {
		return await this.friendService.getIncomingRequests(auth.username);
	}
}
