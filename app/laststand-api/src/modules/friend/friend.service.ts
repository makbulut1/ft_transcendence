import { ALREADY_REQUESTED, HAVENT_FRIEND_REQUEST } from "@/error/errors";
import { DatabaseService } from "@/modules/database/database.service";
import { Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { User } from "@shared/models";

@Injectable()
export class FriendService {
	private readonly logger = new Logger("FRIEND");

	constructor(private readonly databaseService: DatabaseService) {}

	async getFriends(username: string): Promise<User[]> {
		const query = await this.prisma.friend.findMany({
			where: {
				OR: [{ userName: username }, { friendName: username }],
				approved: true,
			},
			include: {
				friend: {
					select: {
						avatar: true,
						name: true,
					},
				},
				user: {
					select: {
						avatar: true,
						name: true,
					},
				},
			},
		});

		return query.map<User>((x) => (x.userName == username ? x.friend : x.user));
	}

	async getFriendOf(username: string, friendName: string): Promise<User> {
		const query = await this.prisma.friend.findFirst({
			where: {
				OR: [
					{ userName: username, friendName: friendName },
					{ userName: friendName, friendName: username },
				],
				approved: true,
			},
			include: {
				friend: {
					select: {
						avatar: true,
						name: true,
					},
				},
				user: {
					select: {
						avatar: true,
						name: true,
					},
				},
			},
		});

		if (!query) {
			throw new Error(`There isn't a friendship between ${username} and ${friendName}`);
		}

		return query.user.name == username ? query.user : query.friend;
	}

	async makeRequest(username: string, friendName: string) {
		const query = await this.prisma.blockedUser.findFirst({
			where: {
				OR: [
					{
						blockedUserName: username,
						blockedByUserName: friendName,
					},
					{
						blockedUserName: friendName,
						blockedByUserName: username,
					},
				],
			},
		});

		if (query) {
			throw `Blocked user`;
		}

		try {
			await this.prisma.friend.create({
				data: {
					userName: username,
					friendName: friendName,
				},
			});
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code == "P2002") {
					throw ALREADY_REQUESTED(username, friendName);
				}
			}
		}
	}

	async hasFriendship(username: string, friendName: string): Promise<boolean> {
		const query = await this.prisma.friend.findFirst({
			where: {
				approved: true,
				OR: [
					{ userName: username, friendName },
					{ userName: friendName, friendName: username },
				],
			},
		});

		return !!query;
	}

	async hasRequested(username: string, friendName: string): Promise<boolean> {
		const query = await this.prisma.friend.findFirst({
			where: {
				approved: false,
				userName: username,
				friendName,
			},
		});

		return !!query;
	}

	async approveRequest(username: string, friendName: string) {
		const update = await this.prisma.friend.updateMany({
			where: {
				userName: friendName,
				friendName: username,
				approved: false,
			},
			data: {
				approved: true,
			},
		});

		if (update.count == 0) {
			throw HAVENT_FRIEND_REQUEST(username, friendName);
		}
	}

	async cancelRequest(username: string, friendName: string) {
		try {
			await this.prisma.friend.delete({
				where: {
					userName_friendName: {
						userName: username,
						friendName: friendName,
					},
				},
			});
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code == "P2025") {
					throw HAVENT_FRIEND_REQUEST(username, friendName);
				}
			}
			throw err;
		}
	}

	async denyRequest(username: string, friendName: string) {
		await this.prisma.friend.delete({
			where: {
				userName_friendName: {
					userName: friendName,
					friendName: username,
				},
			},
		});
		this.logger.log(`${username} denied ${friendName}'s friend request`);
	}

	async destroyFriendship(username: string, friendName: string) {
		await this.prisma.friend.deleteMany({
			where: {
				OR: [
					{
						userName: username,
						friendName: friendName,
					},
					{
						userName: friendName,
						friendName: username,
					},
				],
			},
		});
	}

	async getIncomingRequests(username: string): Promise<User[]> {
		const query = await this.prisma.user.findMany({
			where: {
				friends: {
					some: {
						friendName: username,
						approved: false,
					},
				},
			},
		});

		return query;
	}

	async getWaitingRequests(username: string): Promise<User[]> {
		const query = await this.prisma.friend.findMany({
			where: {
				userName: username,
				approved: false,
			},
			select: {
				friend: {
					select: {
						name: true,
						avatar: true,
					},
				},
			},
		});

		return query.map<User>((x) => x.friend);
	}

	async getPossibleFriends(username: string): Promise<User[]> {
		const query = await this.prisma.user.findMany({
			where: {
				AND: [
					{ NOT: { name: username } },
					{
						blockedUsers: { none: { blockedUserName: username } },
						blockedBy: { none: { blockedByUserName: username } },
					},
					{
						friends: {
							none: {
								OR: [{ userName: username }, { friendName: username }],
							},
						},
						friendBy: {
							none: {
								OR: [{ userName: username }, { friendName: username }],
							},
						},
					},
				],
			},
			select: {
				avatar: true,
				name: true,
			},
		});

		return query;
	}

	private get prisma() {
		return this.databaseService.prisma;
	}
}
