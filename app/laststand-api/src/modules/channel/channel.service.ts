import { Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "@/modules/database/database.service";
import { Channel, ChannelInvite, ChannelMember, ChannelType, User } from "@shared/models";
import { sha256 } from "@/crypto/sha256";
import {
	ALREADY_INVITED,
	ALREADY_MEMBER,
	AN_ERROR_OCCURRED,
	CHANNEL_DOESNT_EXISTS,
	MEMBER_IS_BANNED,
	NEED_PRIVILEGES,
	NOT_A_MEMBER,
	NOT_A_PRIVATE_CHANNEL,
	IT_IS_OWNER,
	CANNOT_KICK,
	WRONG_PASSWORD,
	NOT_INVITED,
	CHANNEL_ALREADY_EXISTS,
	USER_DOESNT_EXISTS,
	ADMIN_CANNOT_BANNED,
	MEMBER_MUTED,
	WRONG_INPUT,
} from "@/error/errors";
import { Prisma } from "@prisma/client";
import moment from "moment";

@Injectable()
export class ChannelService {
	constructor(private readonly databaseService: DatabaseService) {}

	async invite(
		username: string,
		invitedBy: string,
		channelName: string,
	): Promise<[User, ChannelMember, Channel]> {
		try {
			const channel = await this.prisma.channel.findFirst({
				where: {
					name: channelName,
				},
				include: {
					channelMembers: {
						where: {
							OR: [{ userName: username }, { userName: invitedBy }],
						},
						include: {
							user: {
								select: {
									avatar: true,
									name: true,
								},
							},
						},
					},
				},
			});

			if (!channel) {
				throw CHANNEL_DOESNT_EXISTS(channelName);
			}

			if (channel.type != "private") {
				throw NOT_A_PRIVATE_CHANNEL(channelName);
			}

			const inviter = channel.channelMembers.find((x) => x.userName == invitedBy);
			const target = channel.channelMembers.find((x) => x.userName == username);

			if (target) {
				throw ALREADY_MEMBER(username, channelName);
			}
			if (!inviter) {
				throw NOT_A_MEMBER(invitedBy, channelName);
			}
			if (inviter.banned) {
				throw AN_ERROR_OCCURRED(); // MEMBER_IS_BANNED(invitedBy, channelName); // This might be too
			}
			if (inviter.type == "member") {
				throw NEED_PRIVILEGES(invitedBy);
			}

			const { user: invitedUser } = await this.prisma.channelInvite.create({
				data: {
					channelName,
					userName: username,
					invitedByName: invitedBy,
				},
				include: {
					user: {
						select: {
							avatar: true,
							name: true,
						},
					},
				},
			});

			return [
				invitedUser,
				inviter,
				{
					name: channel.name,
					type: channel.type,
				},
			];
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				switch (err.code) {
					case "P2002":
						throw ALREADY_INVITED(username, channelName);
				}
			}
			throw err;
		}
	}
	async leaveChannel(username: string, channelName: string): Promise<[ChannelMember, Channel]> {
		const channel = await this.prisma.channel.findFirst({
			where: {
				name: channelName,
			},
			include: {
				channelMembers: {
					where: {
						userName: username,
					},
					select: {
						banned: true,
						type: true,
						user: {
							select: {
								avatar: true,
								name: true,
							},
						},
						muteEnd: true,
						muteStart: true,
					},
				},
			},
		});

		if (!channel) {
			throw CHANNEL_DOESNT_EXISTS(channelName);
		}

		const member = channel.channelMembers[0];

		if (!member) {
			throw NOT_A_MEMBER(username, channelName);
		}

		if (member.type == "owner") {
			throw IT_IS_OWNER(username, channelName);
		}

		if (member.banned) {
			throw AN_ERROR_OCCURRED(); // I think we don't need to give too many details about that.
		}

		// NOTE:	make a relation between participant and member,
		// 			so we don't need to delete them separately
		const deleteParticipant = this.prisma.participant.deleteMany({
			where: {
				userName: username,
				conversation: {
					channel: {
						name: channelName,
					},
				},
			},
		});
		const deleteMember = this.prisma.channelMember.deleteMany({
			where: {
				channelName,
				userName: username,
			},
		});

		await this.prisma.$transaction([deleteMember, deleteParticipant]);

		return [member, { name: channel.name, type: channel.type }];
	}
	async deleteChannel(channelName: string, by: string): Promise<[Channel, ChannelMember]> {
		const channel = await this.prisma.channel.findFirst({
			where: {
				name: channelName,
			},
			include: {
				channelMembers: {
					where: {
						userName: by,
					},
					select: {
						banned: true,
						type: true,
						user: {
							select: {
								avatar: true,
								name: true,
							},
						},
						muteEnd: true,
						muteStart: true,
					},
				},
			},
		});

		if (!channel) {
			throw CHANNEL_DOESNT_EXISTS(channelName);
		}

		const deletedBy = channel.channelMembers[0];

		if (!deletedBy) {
			throw NOT_A_MEMBER(by, channelName);
		}

		if (deletedBy.type != "owner") {
			throw NEED_PRIVILEGES(by);
		}

		// Channels related with conversation, so it'll delete cascade.
		await this.prisma.conversation.delete({
			where: { id: channel.conversationId },
		});

		return [{ name: channel.name, type: channel.type }, deletedBy];
	}
	async kickUser(
		username: string,
		by: string,
		channelName: string,
	): Promise<[ChannelMember, ChannelMember, Channel]> {
		if (username == by) {
			throw CANNOT_KICK(username);
		}

		const channel = await this.prisma.channel.findFirst({
			where: {
				name: channelName,
			},
			select: {
				name: true,
				type: true,
				channelMembers: {
					where: {
						OR: [{ userName: username }, { userName: by }],
					},
					select: {
						banned: true,
						type: true,
						user: {
							select: {
								avatar: true,
								name: true,
							},
						},
						muteEnd: true,
						muteStart: true,
					},
				},
			},
		});

		if (!channel) {
			throw CHANNEL_DOESNT_EXISTS(channelName);
		}

		const kicker = channel.channelMembers.find((x) => x.user.name == by);
		const kicked = channel.channelMembers.find((x) => x.user.name == username);

		if (!kicker) {
			throw NOT_A_MEMBER(by, channelName);
		}
		if (!kicked) {
			throw NOT_A_MEMBER(username, channelName);
		}

		// Members cannot kick someone
		if (kicker.type == "member") {
			throw NEED_PRIVILEGES(kicker.user.name);
		}
		// Admins cannot kick another admin
		if (kicked.type == "admin" && kicker.type != "owner") {
			throw NEED_PRIVILEGES(kicker.user.name);
		}
		// Owners cannot be kicked.
		if (kicked.type == "owner") {
			throw IT_IS_OWNER(kicked.user.name, channelName);
		}

		// NOTE:	make a relation between participant and member,
		// 			so we don't need to delete them separately
		const deleteParticipant = this.prisma.participant.deleteMany({
			where: {
				userName: username,
				conversation: {
					channel: {
						name: channelName,
					},
				},
			},
		});
		const deleteMember = this.prisma.channelMember.deleteMany({
			where: {
				channelName,
				userName: username,
			},
		});

		await this.prisma.$transaction([deleteMember, deleteParticipant]);

		return [kicked, kicker, channel];
	}
	async joinChannel(
		username: string,
		channelName: string,
		password?: string,
	): Promise<[ChannelMember, Channel]> {
		let deleteInvite;
		const channel = await this.prisma.channel.findFirst({
			where: {
				name: channelName,
			},
			include: {
				channelMembers: {
					where: {
						userName: username,
					},
				},
				invitings: {
					where: {
						userName: username,
					},
				},
			},
		});

		if (!channel) {
			throw CHANNEL_DOESNT_EXISTS(channelName);
		}
		if (channel.channelMembers.length > 0) {
			throw ALREADY_MEMBER(username, channelName);
		}

		if (channel.type == "protected") {
			if (channel.password != sha256(password)) {
				throw WRONG_PASSWORD();
			}
		} else if (channel.type == "private") {
			const invite = channel.invitings.find((x) => x.userName == username);
			if (!invite) {
				throw NOT_INVITED(username, channelName);
			}

			deleteInvite = this.prisma.channelInvite.delete({
				where: {
					userName_channelName: {
						userName: username,
						channelName: channelName,
					},
				},
			});
		}

		const createParticipant = this.prisma.participant.create({
			data: {
				userName: username,
				conversationId: channel.conversationId,
			},
		});

		const createMember = this.prisma.channelMember.create({
			data: {
				userName: username,
				channelName,
			},
			select: {
				user: {
					select: {
						avatar: true,
						name: true,
					},
				},
				banned: true,
				type: true,
				muteStart: true,
				muteEnd: true,
			},
		});

		const transactions: [typeof createMember, typeof createParticipant, typeof deleteInvite] = [
			createMember,
			createParticipant,
			deleteInvite,
		];

		if (!deleteInvite) {
			transactions.pop();
		}

		const [member] = await this.prisma.$transaction(transactions);

		return [member, { name: channel.name, type: channel.type }];
	}
	async unmuteMember(
		username: string,
		by: string,
		channelName: string,
	): Promise<[ChannelMember, ChannelMember, Channel]> {
		const channel = await this.prisma.channel.findFirst({
			where: {
				name: channelName,
			},
			select: {
				name: true,
				type: true,
				channelMembers: {
					where: {
						OR: [{ userName: username }, { userName: by }],
					},
					select: {
						id: true,
						type: true,
						banned: true,
						muteEnd: true,
						muteStart: true,
						user: {
							select: {
								name: true,
								avatar: true,
							},
						},
					},
				},
			},
		});

		if (!channel) {
			throw CHANNEL_DOESNT_EXISTS(channelName);
		}

		const unmutedMember = channel.channelMembers.find((x) => x.user.name == username);
		const unmutedBy = channel.channelMembers.find((x) => x.user.name == by);

		if (!unmutedMember) {
			throw NOT_A_MEMBER(username, channelName);
		}

		if (!unmutedBy) {
			throw NOT_A_MEMBER(by, channelName);
		}

		try {
			const unmutedMemberUpdated = await this.prisma.channelMember.update({
				where: {
					id: unmutedMember.id,
				},
				data: {
					muteStart: null,
					muteEnd: null,
				},
				select: {
					type: true,
					banned: true,
					muteEnd: true,
					muteStart: true,
					user: {
						select: {
							name: true,
							avatar: true,
						},
					},
				},
			});

			delete unmutedBy.id;
			delete channel.channelMembers;

			return [unmutedMemberUpdated, unmutedBy, channel];
		} catch (err) {
			throw err;
		}
	}
	async muteMember(
		username: string,
		by: string,
		channelName: string,
		minute: number,
	): Promise<[ChannelMember, ChannelMember, Channel]> {
		const channel = await this.prisma.channel.findFirst({
			where: {
				name: channelName,
			},
			select: {
				name: true,
				type: true,
				channelMembers: {
					where: {
						OR: [{ userName: username }, { userName: by }],
					},
					select: {
						id: true,
						type: true,
						banned: true,
						muteEnd: true,
						muteStart: true,
						user: {
							select: {
								name: true,
								avatar: true,
							},
						},
					},
				},
			},
		});

		if (!channel) {
			throw CHANNEL_DOESNT_EXISTS(channelName);
		}

		const mutedMember = channel.channelMembers.find((x) => x.user.name == username);
		const mutedBy = channel.channelMembers.find((x) => x.user.name == by);

		if (!mutedMember) {
			throw NOT_A_MEMBER(username, channelName);
		}

		if (!mutedBy) {
			throw NOT_A_MEMBER(by, channelName);
		}

		const muteStart = new Date(Date.now());
		const muteEnd = moment(muteStart).add(minute, "m").toDate();

		try {
			const mutedMemberUpdated = await this.prisma.channelMember.update({
				where: {
					id: mutedMember.id,
				},
				data: {
					muteStart,
					muteEnd,
				},
				select: {
					type: true,
					banned: true,
					muteEnd: true,
					muteStart: true,
					user: {
						select: {
							name: true,
							avatar: true,
						},
					},
				},
			});

			delete mutedBy.id;
			delete channel.channelMembers;
			return [mutedMemberUpdated, mutedBy, channel];
		} catch (err) {
			throw err;
		}
	}
	async approveInvite(username: string, channelName: string) {
		// Simply it is the same thing with joinChannel.
		return await this.joinChannel(username, channelName);
	}
	async denyInvite(username: string, channelName: string) {
		try {
			await this.prisma.channelInvite.delete({
				where: {
					userName_channelName: {
						userName: username,
						channelName,
					},
				},
			});
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				switch (err.code) {
					case "P2025":
						throw NOT_INVITED(username, channelName);
				}
			}
		}
	}
	async createChannel(username: string, channel: Channel, password?: string): Promise<Channel> {
		const existChannel = await this.prisma.channel.findFirst({
			where: {
				name: channel.name,
			},
		});

		if (existChannel) {
			throw CHANNEL_ALREADY_EXISTS(channel.name);
		}

		if (channel.type == "protected") {
			if (!password || password == "" || password.length < 3) {
				throw WRONG_PASSWORD(); // I know it's meaningless.
			}
		}

		try {
			const createdChannel = await this.prisma.channel.create({
				data: {
					type: channel.type,
					name: channel.name,
					password: password ? sha256(password) : undefined,
					channelMembers: {
						create: {
							userName: username,
							type: "owner",
							banned: false,
						},
					},
					conversation: {
						create: {
							participants: {
								create: {
									userName: username,
								},
							},
						},
					},
				},
				select: {
					name: true,
					type: true,
					channelMembers: {
						select: {
							banned: true,
							type: true,
							user: {
								select: {
									name: true,
									avatar: true,
								},
							},
							muteStart: true,
							muteEnd: true,
						},
					},
				},
			});

			return {
				name: createdChannel.name,
				type: createdChannel.type,
				members: createdChannel.channelMembers,
			};
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code == "P2003") {
					throw USER_DOESNT_EXISTS(username);
				}
			}
			throw err;
		}
	}
	async makeAdmin(
		username: string,
		channelName: string,
		by: string,
	): Promise<[ChannelMember, Channel, ChannelMember]> {
		return await this.updateMemberData(
			username,
			channelName,
			by,
			{ type: "admin" },
			(by, member) => {
				if (by.type == "member") {
					throw NEED_PRIVILEGES(by.user.name);
				}
				if (member.type == "owner") {
					throw IT_IS_OWNER(username, channelName);
				}
				if (member.type == "admin") {
					return false; // Just ignore it.
				}
				return true;
			},
		);
	}
	async takeAdmin(
		username: string,
		channelName: string,
		by: string,
	): Promise<[ChannelMember, Channel, ChannelMember]> {
		return await this.updateMemberData(
			username,
			channelName,
			by,
			{ type: "member" },
			(by, member) => {
				if (by.type == "member") {
					throw NEED_PRIVILEGES(by.user.name);
				}
				if (member.type == "owner") {
					throw IT_IS_OWNER(username, channelName);
				}
				if (member.type == "member") {
					return false; // Just ignore it.
				}
				return true;
			},
		);
	}
	async banMember(
		username: string,
		channelName: string,
		by: string,
	): Promise<[ChannelMember, Channel, ChannelMember]> {
		return await this.updateMemberData(
			username,
			channelName,
			by,
			{ banned: true },
			(by, member) => {
				if (by.type == "member") {
					throw NEED_PRIVILEGES(by.user.name);
				}
				if (member.type == "owner") {
					throw IT_IS_OWNER(username, channelName);
				}
				if (member.type == "admin" && by.type != "owner") {
					throw ADMIN_CANNOT_BANNED();
				}
				if (member.banned) {
					return false;
				}
				return true;
			},
		);
	}
	async unblockMember(
		username: string,
		channelName: string,
		by: string,
	): Promise<[ChannelMember, Channel, ChannelMember]> {
		return await this.updateMemberData(
			username,
			channelName,
			by,
			{ banned: false },
			(by, member) => {
				if (by.type == "member") {
					throw NEED_PRIVILEGES(by.user.name);
				}
				if (member.type == "owner") {
					throw IT_IS_OWNER(username, channelName);
				}
				if (member.type == "admin" && by.type != "owner") {
					throw ADMIN_CANNOT_BANNED();
				}
				if (!member.banned) {
					return false;
				}
				return true;
			},
		);
	}
	async editChannel(
		username: string,
		channelName: string,
		type: ChannelType,
		password?: string,
	): Promise<Channel> {
		const channel = await this.prisma.channel.findFirst({
			where: {
				name: channelName,
			},
			select: {
				name: true,
				type: true,
				channelMembers: {
					where: {
						userName: username,
					},
				},
			},
		});

		if (!channel) {
			throw CHANNEL_DOESNT_EXISTS(channelName);
		}

		if (channel.channelMembers[0]?.type != "owner") {
			throw NEED_PRIVILEGES(username);
		}

		if (type == "protected" && (!password || password == "")) {
			throw WRONG_INPUT();
		}

		const updatedChannel = await this.prisma.channel.update({
			where: {
				name: channelName,
			},
			data: {
				type,
				password,
			},
			select: {
				name: true,
				type: true,
			},
		});

		return updatedChannel;
	}

	async canMessageSend(username: string, channelName: string): Promise<boolean> {
		const query = await this.prisma.channel.findFirst({
			where: {
				name: channelName,
			},
			include: {
				channelMembers: {
					where: {
						userName: username,
					},
				},
			},
		});

		if (!query) {
			throw CHANNEL_DOESNT_EXISTS(channelName);
		}

		const member = query.channelMembers[0];

		if (!member) {
			throw NOT_A_MEMBER(username, channelName);
		}
		if (member.banned) {
			throw AN_ERROR_OCCURRED();
		}

		if (member.muteStart) {
			const now = moment(new Date());

			if (now.isBetween(member.muteStart, member.muteEnd)) {
				throw MEMBER_MUTED(username, channelName);
			}
		}

		return true;
	}

	async getInvites(username: string): Promise<ChannelInvite[]> {
		const query = await this.prisma.channelInvite.findMany({
			where: {
				userName: username,
			},
		});

		return query.map<ChannelInvite>((x) => ({
			channelName: x.channelName,
			invitedBy: x.invitedByName,
			username: x.userName,
		}));
	}

	async getMember(username: string, channelName: string): Promise<ChannelMember> {
		const query = await this.prisma.channelMember.findFirst({
			where: {
				userName: username,
				channelName,
			},
			select: {
				user: {
					select: {
						avatar: true,
					},
				},
				banned: true,
				muteStart: true,
				muteEnd: true,
				type: true,
			},
		});

		if (!query) {
			throw NOT_A_MEMBER(username, channelName);
		}

		return {
			user: {
				name: username,
				avatar: query.user.avatar,
			},
			type: query.type,
			banned: query.banned,
			muteStart: query.muteStart,
			muteEnd: query.muteEnd,
		};
	}

	async getChannel(channelName: string, fill?: boolean) {
		const query = await this.prisma.channel.findFirst({
			where: {
				name: channelName,
			},
			include: fill
				? {
						channelMembers: {
							include: {
								user: true,
							},
						},
				  }
				: undefined,
		});

		if (!query) {
			throw CHANNEL_DOESNT_EXISTS(channelName);
		}

		return query;
	}

	async getAvailableChannels(username: string): Promise<Channel[]> {
		const query = await this.prisma.channel.findMany({
			where: {
				channelMembers: {
					none: {
						userName: username,
					},
				},
				NOT: {
					type: "private",
				},
			},
		});

		return query.map<Channel>((row) => ({
			name: row.name,
			type: row.type,
		}));
	}

	async getJoinedChannels(username: string): Promise<Channel[]> {
		const query = await this.prisma.channel.findMany({
			where: {
				channelMembers: {
					some: {
						userName: username,
						banned: false,
					},
				},
			},
			select: {
				name: true,
				type: true,
			},
		});

		return query;
	}

	private async updateMemberData(
		username: string,
		channelName: string,
		by: string,
		newData: Partial<ChannelMember>,
		checkAuthorized?: (by: ChannelMember, member: ChannelMember) => boolean,
	): Promise<[ChannelMember, Channel, ChannelMember]> {
		if (username == by) {
			throw AN_ERROR_OCCURRED();
		}

		const channel = await this.prisma.channel.findFirst({
			where: {
				name: channelName,
			},
			select: {
				name: true,
				type: true,
				channelMembers: {
					where: {
						OR: [{ userName: username }, { userName: by }],
					},
					include: {
						user: true,
					},
				},
			},
		});

		if (!channel) {
			throw CHANNEL_DOESNT_EXISTS(channelName);
		}

		const member = channel.channelMembers.find((x) => x.user.name == username);
		const authorized = channel.channelMembers.find((x) => x.user.name == by);

		if (!member) {
			throw NOT_A_MEMBER(username, channelName);
		}
		if (!authorized) {
			throw NOT_A_MEMBER(by, channelName);
		}

		if (checkAuthorized) {
			if (!checkAuthorized(authorized, member)) {
				return;
			}
		}

		const newMember = await this.prisma.channelMember.update({
			where: {
				id: member.id,
			},
			data: {
				banned: newData.banned,
				muteStart: newData.muteStart,
				muteEnd: newData.muteEnd,
				type: newData.type,
				userName: newData.user?.name,
			},
			select: {
				banned: true,
				muteStart: true,
				muteEnd: true,
				type: true,
				user: {
					select: {
						name: true,
						avatar: true,
					},
				},
			},
		});

		channel.channelMembers = [];
		return [newMember, channel, authorized];
	}

	private get prisma() {
		return this.databaseService.prisma;
	}
}
