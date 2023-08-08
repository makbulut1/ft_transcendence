import { Authorization } from "@/decorators/auth.decorator";
import { ChannelService } from "@/modules/channel/channel.service";
import { GetChannelDTO } from "@/modules/channel/dto/GetChannel.dto";
import { GetMembersDTO } from "@/modules/channel/dto/GetMembers.dto";
import { Controller, Get, HttpException, HttpStatus, Logger, Query } from "@nestjs/common";
import { ChannelMember, JwtUser } from "@shared/models";

@Controller("channels")
export class ChannelController {
	constructor(private readonly channelService: ChannelService) {}

	@Get()
	async getChannel(@Authorization() auth: JwtUser, @Query() query: GetChannelDTO) {
		try {
			const channel = await this.channelService.getChannel(query.name, true);
			return {
				name: channel.name,
				type: channel.type,
				members: channel.channelMembers.map<ChannelMember>((member) => ({
					banned: member.banned,
					type: member.type,
					user: member.user,
					muteEnd: member.muteEnd,
					muteStart: member.muteStart,
				})),
			};
		} catch (err) {
			Logger.error(err);
			throw new HttpException(err, HttpStatus.NOT_FOUND);
		}
	}

	@Get("my")
	async getMyChannels(@Authorization() auth: JwtUser) {
		return await this.channelService.getJoinedChannels(auth.username);
	}

	@Get("available")
	async getAvailableChannels(@Authorization() auth: JwtUser) {
		return await this.channelService.getAvailableChannels(auth.username);
	}

	@Get("members")
	async getMembers(@Authorization() auth: JwtUser, @Query() query: GetMembersDTO) {
		try {
			return await this.channelService.getMember(query.memberName, query.channelName);
		} catch (err) {
			throw new HttpException(err, HttpStatus.UNAUTHORIZED);
		}
	}

	@Get("invites")
	async getInvites(@Authorization() auth: JwtUser) {
		return await this.channelService.getInvites(auth.username);
	}
}
