import {
	AN_ERROR_OCCURRED,
	NAME_MUST_BE_UNIQUE,
	USER_DOESNT_EXISTS,
	USER_NOT_BLOCKED,
	WRONG_INPUT,
} from "@/error/errors";
import { v4 as uuidv4 } from "uuid";
import { DatabaseService } from "@/modules/database/database.service";
import { Injectable, Logger } from "@nestjs/common";
import { Profile, User } from "@shared/models";
import { achievements } from "@shared/constants/achievements";
import { Prisma } from "@prisma/client";
import { authenticator } from "otplib";
import { existsSync, fstat, mkdirSync, rmSync, writeFileSync } from "fs";
import { basename, join } from "path";

@Injectable()
export class UserService {
	private readonly logger = new Logger("USER");

	constructor(private readonly databaseService: DatabaseService) {}

	async getUser(username: string): Promise<User> {
		try {
			const query = await this.prisma.user.findFirst({
				where: {
					name: username,
				},
				select: {
					name: true,
					avatar: true,
				},
			});
			if (!query) {
				throw USER_DOESNT_EXISTS();
			}
			return query;
		} catch (err) {
			throw USER_DOESNT_EXISTS(username);
		}
	}

	async getUserWithIntraId(intraId: string): Promise<User> {
		const query = await this.prisma.user.findFirst({
			where: {
				intraId,
			},
			select: {
				name: true,
				avatar: true,
			},
		});

		if (!query) {
			throw USER_DOESNT_EXISTS();
		}

		return query;
	}

	async getProfile(username: string, targetUsername: string): Promise<Profile> {
		const query = await this.prisma.user.findFirst({
			where: {
				name: targetUsername,
				blockedUsers: { none: { blockedUserName: username } },
				/* blockedBy: { none: { blockedByUserName: username } }, */
			},
			select: {
				name: true,
				avatar: true,
				wins: true,
				losses: true,
				matchHistoriesP1: {
					select: {
						player1Score: true,
						player2Score: true,
						player1Name: true,
						player2Name: true,
					},
				},
				matchHistoriesP2: true,
				twoFactorAuthSecret: true,
				achievements: {
					select: {
						type: true,
					},
				},
				friendBy: {
					where: {
						userName: username,
						/* approved: true, */
					},
				},
				friends: {
					where: {
						friendName: username,
						/* approved: true, */
					},
				},
				blockedBy: {
					where: {
						blockedUserName: targetUsername,
					},
				},
			},
		});

		if (!query) {
			throw USER_DOESNT_EXISTS();
		}

		let friendRequest: "incoming" | "outgoing" | undefined;
		let isFriend = false;
		const user = query;
		const isBlocked = !!user.blockedBy[0];

		if (user.friendBy[0]) {
			if (!user.friendBy[0].approved) {
				friendRequest = "outgoing";
			} else {
				isFriend = true;
			}
		}

		if (user.friends[0]) {
			if (!user.friends[0].approved) {
				friendRequest = "incoming";
			} else {
				isFriend = true;
			}
		}

		return {
			name: user.name,
			avatar: user.avatar,
			wins: user.wins,
			losses: user.losses,
			matchHistories: [...user.matchHistoriesP1, ...user.matchHistoriesP2],
			achievements: user.achievements.map((x) => achievements.find((y) => y.type == x.type)),
			twoFactorAuthEnabled: !!user.twoFactorAuthSecret,
			isFriend,
			isBlocked,
			friendRequest,
		};
	}

	async get2FaSecret(username: string): Promise<string> {
		const user = await this.prisma.user.findFirst({
			where: {
				name: username,
			},
			select: {
				twoFactorAuthSecret: true,
			},
		});

		if (!user) {
			throw USER_DOESNT_EXISTS();
		}

		return user.twoFactorAuthSecret;
	}

	async getUsersWithFriends(username: string) {
		const query = await this.prisma.user.findMany({
			where: {
				AND: [
					{ NOT: { name: username } },
					{
						blockedUsers: { none: { blockedUserName: username } },
						blockedBy: { none: { blockedByUserName: username } },
					},
				],
			},
			select: {
				name: true,
				avatar: true,
				friendBy: true,
				friends: true,
			},
		});

		return query.map<User & { isFriend?: boolean }>((x) => {
			const isFriend =
				!!x.friends.find((y) => y.friendName == username && y.approved) ||
				!!x.friendBy.find((y) => y.userName == username && y.approved);

			return {
				name: x.name,
				avatar: x.avatar,
				isFriend,
			};
		});
	}

	async getUsers(username: string, exclude?: "blocked" | "friends"): Promise<User[]> {
		const query = await this.prisma.user.findMany({
			where: {
				AND: [
					{ NOT: { name: username } },
					exclude === "blocked"
						? {
								blockedUsers: { none: { blockedUserName: username } },
								blockedBy: { none: { blockedByUserName: username } },
						  }
						: {},
					exclude === "friends"
						? {
								friends: {
									none: {
										OR: [{ friendName: username }, { userName: username }],
									},
								},
						  }
						: {},
				],
			},
			select: {
				avatar: true,
				name: true,
			},
		});

		return query;
	}

	async updateUser(
		username: string,
		data: { name: string; avatar?: string; twoFactorAuthEnabled: boolean },
	): Promise<[User, User]> {
		const oldUser = (await this.checkExistence([username]))[0];
		try {
			if (data.avatar) {
				const cdnPath = join(process.cwd(), "cdn");
				if (!existsSync(cdnPath)) {
					mkdirSync(cdnPath, { recursive: true });
				}

				const regex = /^data:.+\/(.+);base64,(.*)$/;
				const matches = data.avatar.match(regex);
				const fileExtension = matches[1];
				const imageData = matches[2];
				const path = `/cdn/${uuidv4()}.${fileExtension}`;
				const buffer = Buffer.from(imageData, "base64");
				const oldImagePath = join(process.cwd(), "cdn", basename(oldUser.avatar));
				writeFileSync(`.${path}`, buffer);

				if (existsSync(oldImagePath)) {
					rmSync(oldImagePath);
				}

				data.avatar = `http://${process.env.API_HOST}:${process.env.API_PORT}${path}`;
			}

			const user = await this.prisma.user.update({
				where: {
					name: username,
				},
				data: {
					name: data.name,
					avatar: data.avatar,
					twoFactorAuthSecret: data.twoFactorAuthEnabled
						? authenticator.generateSecret()
						: null,
				},
			});
			return [
				oldUser,
				{
					avatar: user.avatar,
					name: user.name,
				},
			];
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				throw AN_ERROR_OCCURRED();
				// throw NAME_MUST_BE_UNIQUE();
			}
			this.logger.error(err);
			throw AN_ERROR_OCCURRED();
		}
	}

	async isBlocked(username: string, by: string): Promise<boolean> {
		// Check existence of users.
		await this.checkExistence([username, by]);

		const query = await this.prisma.blockedUser.findFirst({
			where: {
				blockedUserName: username,
				blockedByUserName: by,
			},
		});

		return !!query;
	}

	async blockUser(username: string, blockedUsername: string): Promise<User> {
		try {
			await this.checkExistence([username, blockedUsername]);

			const block = await this.prisma.blockedUser.create({
				data: {
					blockedByUserName: username,
					blockedUserName: blockedUsername,
				},
				select: {
					blockedUser: {
						select: {
							avatar: true,
							name: true,
						},
					},
				},
			});

			return block.blockedUser;
		} catch (err) {
			this.logger.error(err);
			throw AN_ERROR_OCCURRED();
		}
	}

	async unblockUser(username: string, blockedUsername: string): Promise<User> {
		const isBlocked = await this.isBlocked(blockedUsername, username);

		if (!isBlocked) {
			throw USER_NOT_BLOCKED(blockedUsername, username);
		}

		const unblockedUser = await this.prisma.blockedUser.delete({
			where: {
				blockedUserName_blockedByUserName: {
					blockedByUserName: username,
					blockedUserName: blockedUsername,
				},
			},
			select: {
				blockedUser: {
					select: {
						avatar: true,
						name: true,
					},
				},
			},
		});

		return unblockedUser.blockedUser;
	}
	/*
	
	Fonksiyonun varlığını unutup yeniden yazan bana selam olsun...

	async getBlockedUsers(username: string): Promise<User[]> {
		await this.checkExistence([username]);
		const query = await this.prisma.blockedUser.findMany({
			where: {
				blockedByUserName: username,
			},
			select: {
				blockedUser: {
					select: {
						name: true,
						avatar: true,
					},
				},
			},
		});

		return query.map<User>((x) => x.blockedUser);
	} */

	async getBlockedUsers(username: string): Promise<User[]> {
		await this.checkExistence([username]);
		const query = await this.prisma.blockedUser.findMany({
			where: {
				blockedByUserName: username,
			},
			select: {
				blockedUser: {
					select: {
						avatar: true,
						name: true,
					},
				},
			},
		});

		return query.map((x) => x.blockedUser);
	}
	async getBlockedByUsers(username: string): Promise<User[]> {
		await this.checkExistence([username]);
		const query = await this.prisma.blockedUser.findMany({
			where: {
				blockedUserName: username,
			},
			select: {
				blockedBy: {
					select: {
						avatar: true,
						name: true,
					},
				},
			},
		});

		return query.map((x) => x.blockedBy);
	}

	async getOrCreateUser(
		username: string,
		avatar: string,
		intraId: string,
	): Promise<[User, boolean]> {
		try {
			return [await this.getUserWithIntraId(intraId), false];
		} catch (err) {
			return [await this.createUser(username, avatar, intraId), true];
		}
	}

	async createUser(username: string, avatar: string, intraId: string): Promise<User> {
		try {
			return await this.prisma.user.create({
				data: {
					name: username,
					intraId,
					avatar,
				},
				select: {
					name: true,
					avatar: true,
				},
			});
		} catch (err) {
			this.logger.error(err);
			// Non unique fields.
			throw WRONG_INPUT();
		}
	}

	private async checkExistence(usernames: string[]): Promise<User[]> {
		const users = await this.prisma.user.findMany({
			where: {
				OR: usernames.map((x) => ({
					name: x,
				})),
			},
			select: {
				avatar: true,
				name: true,
			},
		});

		if (!users) {
			throw AN_ERROR_OCCURRED();
		}

		for (const name of usernames) {
			const found = users.find((x) => x.name == name);

			if (!found) {
				throw USER_DOESNT_EXISTS(name);
			}
		}

		return users;
	}

	private get prisma() {
		return this.databaseService.prisma;
	}
}
