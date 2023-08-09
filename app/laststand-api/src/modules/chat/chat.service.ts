import { Injectable, Logger } from "@nestjs/common";
import { Channel, Conversation, Message } from "@shared/models";
import { sortConversationList } from "@shared/utils/sort";
import { DatabaseService } from "@/modules/database/database.service";
import { Prisma } from "@prisma/client";
import { EMPTY_MESSAGE } from "@/error/errors";
import { UserService } from "@/modules/user/user.service";

@Injectable()
export class ChatService {
	constructor(
		private readonly databaseService: DatabaseService,
		private readonly userService: UserService,
	) {}

	async saveMessage(message: Message, conversationInfo: Conversation): Promise<Message> {
		if (message.content == "") {
			throw EMPTY_MESSAGE();
		}

		// Create a new conversation if doesn't exists.
		const conversation =
			(await this.getConversation(message.ownerName, conversationInfo)) ??
			(await this.prisma.conversation.create({
				data: {
					participants: {
						createMany: {
							data: [
								{ userName: message.ownerName },
								{ userName: conversationInfo.name },
							],
						},
					},
				},
			}));

		const savedMessage = await this.prisma.message.create({
			data: {
				content: message.content,
				sentDate: new Date(),
				ownerName: message.ownerName,
				conversationId: conversation.id,
			},
			select: {
				content: true,
				sentDate: true,
				ownerName: true,
			},
		});

		return savedMessage;
	}

	async getConversation(username: string, conversation: Conversation) {
		if (conversation.type == "private") {
			return await this.prisma.conversation.findFirst({
				where: {
					participants: {
						every: {
							OR: [{ userName: username }, { userName: conversation.name }],
						},
					},
					channel: {
						isNot: {},
					},
				},
			});
		} else {
			return await this.prisma.conversation.findFirst({
				where: {
					channel: {
						name: conversation.name,
					},
				},
			});
		}
	}

	async getChat(
		username: string,
		conversation: Conversation,
		fillMessages?: boolean,
	): Promise<Conversation> {
		let whereQuery: Prisma.ConversationWhereInput = {};
		let participantsInclude: Prisma.Conversation$participantsArgs;

		if (conversation.type == "private") {
			whereQuery = {
				participants: {
					every: {
						OR: [
							{
								userName: username,
							},
							{ userName: conversation.name },
						],
					},
				},
				channel: {
					isNot: {},
				},
			};

			participantsInclude = {
				where: {
					userName: conversation.name,
				},
				include: {
					user: {
						select: {
							avatar: true,
						},
					},
				},
			};
		} else {
			whereQuery = {
				channel: {
					name: {
						equals: conversation.name,
					},
					channelMembers: {
						none: {
							userName: username,
							banned: true,
						},
					},
				},
			};
		}

		const data = await this.prisma.conversation.findFirst({
			where: whereQuery,
			include: {
				messages: fillMessages
					? {
							where: {
								owner: {
									blockedUsers: {
										none: {
											blockedUserName: username,
										},
									},
									blockedBy: {
										none: {
											blockedByUserName: username,
										},
									},
								},
							},
					  }
					: {
							where: {
								owner: {
									blockedUsers: {
										none: {
											blockedUserName: username,
										},
									},
									blockedBy: {
										none: {
											blockedByUserName: username,
										},
									},
								},
							},
							orderBy: {
								sentDate: "desc",
							},
							take: 1,
							select: {
								content: true,
								ownerName: true,
								sentDate: true,
								owner: {
									select: {
										blockedUsers: true,
									},
								},
							},
					  },
				participants: participantsInclude,
			},
		});

		let avatar = data?.participants[0]?.["user"]?.avatar;

		// NOTE: I know it is too ugly but we need to get user avatar.
		if (!data && conversation.type == "private") {
			const user = await this.prisma.user.findFirst({
				where: {
					name: conversation.name,
				},
				select: {
					avatar: true,
				},
			});

			avatar = user?.avatar;
		}

		return {
			name: conversation.name,
			type: conversation.type,
			messages: data?.messages ?? [],
			image: avatar,
		};
	}

	async getConversationList(username: string): Promise<Conversation[]> {
		const conversations = await this.prisma.conversation.findMany({
			where: {
				participants: {
					some: {
						userName: username,
					},
				},
			},
			include: {
				participants: {
					select: {
						userName: true,
						user: {
							select: {
								avatar: true,
								blockedBy: true,
								blockedUsers: true,
							},
						},
					},
				},
				channel: {
					select: {
						name: true,
						channelMembers: {
							where: {
								userName: username,
							},
							select: {
								banned: true,
							},
						},
					},
				},
				messages: {
					where: {
						owner: {
							blockedUsers: {
								none: {
									blockedUserName: username,
								},
							},
							blockedBy: {
								none: {
									blockedByUserName: username,
								},
							},
						},
					},
					select: {
						content: true,
						ownerName: true,
						sentDate: true,
					},
					orderBy: {
						sentDate: "desc",
					},
					take: 1,
				},
			},
		});

		const list: Conversation[] = [];
		for (const item of conversations) {
			let conversation: Conversation = {
				messages: [],
				name: "",
				type: "private",
			};

			if (item.messages.length > 0) {
				conversation.messages.push(item.messages[0]);
			}

			if (item.channel) {
				if (item.channel.channelMembers[0].banned) {
					continue;
				}
				conversation.name = item.channel.name;
				conversation.type = "channel";
			} else {
				if (item.messages.length == 0) {
					continue;
				}

				const participant = item.participants.find((x) => x.userName != username);
				// If this is a conversation with a blocked user...
				if (
					participant.user.blockedBy.find((x) => x.blockedByUserName == username) ||
					participant.user.blockedUsers.find((x) => x.blockedUserName == username)
				) {
					continue;
				}

				conversation.name = participant.userName;
				conversation.image = participant.user.avatar;
			}

			list.push(conversation);
		}

		sortConversationList(list);
		return list;
	}

	async canChat(username: string, otherUsername: string): Promise<boolean> {
		return !(
			(await this.userService.isBlocked(username, otherUsername)) &&
			(await this.userService.isBlocked(otherUsername, username))
		);
	}

	private get prisma() {
		return this.databaseService.prisma;
	}
}
