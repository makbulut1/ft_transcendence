import {
	ConnectedSocket,
	MessageBody,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import {
	LOGIN,
	SEND_MESSAGE,
	FRIEND_REQUEST,
	FRIEND_CANCEL_REQUEST,
	FRIEND_APPROVE,
	FRIEND_DENY,
	FRIEND_REMOVE,
	CHANNEL_LEAVE,
	CHANNEL_DELETE,
	CHANNEL_APPROVE,
	CHANNEL_DENY,
	CHANNEL_INVITE,
	INCOMING_FRIEND_REQUEST,
	OUTGOING_FRIEND_REQUEST,
	CANCELED_FRIEND_REQUEST,
	REMOVED_FRIEND,
	NOW_FRIEND,
	DENIED_FRIEND,
	LEAVED_CHANNEL,
	DELETED_CHANNEL,
	DENIED_CHANNEL,
	JOINED_CHANNEL,
	INVITED_TO_CHANNEL,
	SENT_INVITE_CHANNEL,
	CHANNEL_CREATE,
	NEW_CHANNEL_APPEARED,
	CREATED_CHANNEL,
	CHANNEL_JOIN,
	RECEIVED_MESSAGE,
	CHANNEL_KICK,
	CHANNEL_MAKE_ADMIN,
	MADE_ADMIN_CHANNEL,
	CHANNEL_TAKE_ADMIN,
	TAKEN_ADMIN_CHANNEL,
	CHANNEL_BAN,
	BANNED_CHANNEL,
	CHANNEL_UNBLOCK,
	UNBLOCKED_CHANNEL,
	BLOCK_USER,
	BLOCKED_USER,
	BLOCKED_BY,
	DENIED_BY,
	UNBLOCK_USER,
	UNBLOCKED_USER,
	UNBLOCKED_BY,
	FRIEND_ONLINE,
	FRIEND_OFFLINE,
	CHANNEL_MUTE,
	MUTED_CHANNEL,
	CHANNEL_UNMUTE,
	UNMUTED_CHANNEL,
	CHANNEL_EDIT,
	EDITED_CHANNEL,
	FRIEND_IN_GAME,
	EDIT_USER,
	USER_EDITED,
	INVITE_MATCH,
	INVITED_TO_MATCH,
	SOCIAL_LOGGED,
} from "@shared/socketEvents";
import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ChannelService } from "@/modules/channel/channel.service";
import { Conversation, Status } from "@shared/models";
import { ChatService } from "@/modules/chat/chat.service";
import { UserService } from "@/modules/user/user.service";
import { FriendService } from "@/modules/friend/friend.service";
import { SendMessageDTO } from "@/modules/social/dto/SendMessage.dto";
import { ChannelLeaveDTO } from "@/modules/social/dto/ChannelLeave.dto";
import { FriendRequestDTO } from "@/modules/social/dto/FriendRequest.dto";
import { FriendApproveDTO } from "@/modules/social/dto/FriendApprove.dto";
import { FriendDenyDTO } from "@/modules/social/dto/FriendDeny.dto";
import { FriendRemoveDTO } from "@/modules/social/dto/FriendRemove.dto";
import { ChannelDeleteDTO } from "@/modules/social/dto/ChannelDelete.dto";
import { ChannelApproveDTO } from "@/modules/social/dto/ChannelApprove.dto";
import { ChannelDenyDTO } from "@/modules/social/dto/ChannelDeny.dto";
import { ChannelInviteDTO } from "@/modules/social/dto/ChannelInvite.dto";
import { ChannelCreateDTO } from "@/modules/social/dto/ChannelCreate.dto";
import { ChannelJoinDTO } from "@/modules/social/dto/ChannelJoin.dto";
import { ChannelKickDTO } from "@/modules/social/dto/ChannelKick.dto";
import { ChannelMakeAdminDTO } from "@/modules/social/dto/ChannelMakeAdmin.dto";
import { ChannelTakeAdminDTO } from "@/modules/social/dto/ChannelTakeAdmin.dto";
import { ChannelBanDTO } from "@/modules/social/dto/ChannelBan.dto";
import { ChannelUnblockDTO } from "@/modules/social/dto/ChannelUnblock.dto";
import { BlockUserDTO } from "@/modules/social/dto/BlockUser.dto";
import { UnblockUserDTO } from "@/modules/social/dto/UnblockUser.dto";
import { LoginDTO } from "@/modules/social/dto/Login.dto";
import { ActivityService } from "@/modules/activity/activity.service";
import { ChannelMuteDTO } from "@/modules/social/dto/ChannelMute.dto";
import { ChannelUnmuteDTO } from "@/modules/social/dto/ChannelUnmute.dto";
import { ChannelEditDTO } from "@/modules/social/dto/ChannelEdit.dto";
import { AuthService } from "@/modules/auth/auth.service";
import { EditUserDTO } from "@/modules/social/dto/EditUser.dto";
import { SocketExceptionFilter } from "@/filters/socketexception.filter";
import { SocketAuthGuard } from "@/guards/socketauth.guard";
import { InviteMatchDTO } from "@/modules/social/dto/InviteMatch.dto";
import { AN_ERROR_OCCURRED, NEED_PRIVILEGES } from "@/error/errors";

const SocketEvent = (event: string) => {
	return (target, key, descriptor) => {
		UsePipes(new ValidationPipe())(target, key, descriptor);
		UseFilters(new SocketExceptionFilter())(target, key, descriptor);
		UseGuards(new SocketAuthGuard())(target, key, descriptor);
		SubscribeMessage(event)(target, key, descriptor);
	};
};

@WebSocketGateway(+process.env.SOCKET_PORT, { namespace: "social", cors: true })
export class SocialGateway implements OnGatewayDisconnect {
	private readonly logger = new Logger("Social_Socket");

	@WebSocketServer()
	server: Server;

	constructor(
		private readonly channelService: ChannelService,
		private readonly friendService: FriendService,
		private readonly chatService: ChatService,
		private readonly userService: UserService,
		private readonly activityService: ActivityService,
		private readonly authService: AuthService,
	) {
		this.activityService.addListener(async (username, status) => {
			const friends = await this.friendService.getFriends(username);
			for (const friend of friends) {
				let statusEvent = {
					online: FRIEND_ONLINE,
					offline: FRIEND_OFFLINE,
					ingame: FRIEND_IN_GAME,
				};

				this.server.to(friend.name).emit(statusEvent[status], {
					friendName: username,
				});
			}
		});
	}

	async handleDisconnect(@ConnectedSocket() client: Socket) {
		const sockets = await this.server.fetchSockets();
		const clientCount = sockets.filter(
			(x) => x.data["username"] == client.data["username"],
		).length;

		if (clientCount == 0) {
			this.activityService.setActivity(client.data["username"], "offline");
		}
	}

	@UsePipes(new ValidationPipe())
	@UseFilters(new SocketExceptionFilter())
	@SubscribeMessage(LOGIN)
	async login(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: LoginDTO,
	) {
		// Already logged in
		if (client.data["username"]) {
			return;
		}
		const userInfo = this.authService.validateJWT(data.token);

		// By default join a room that named with username.
		client.join(userInfo.username);
		client.data["username"] = userInfo.username;
		client.data["avatar"] = userInfo.avatar;

		// Notify all friends that this user is online.
		this.activityService.setActivity(userInfo.username, "online");

		// Join all channels
		const channels = await this.channelService.getJoinedChannels(userInfo.username);
		channels.forEach((ch) => {
			client.join(ch.name);
		});
		client.emit(SOCIAL_LOGGED);
		this.logger.log(`${userInfo.username} logged in`);
	}

	/* Chat */
	@SocketEvent(SEND_MESSAGE)
	async sendMessage(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: SendMessageDTO,
	) {
		const receiverConversation: Conversation = Object.assign({}, data.conversation);
		const senderUser = await this.userService.getUser(client.data["username"]);
		let isAllowed = false;

		if (senderUser.name != data.message.ownerName) {
			throw AN_ERROR_OCCURRED();
		}

		if (data.conversation.type == "private") {
			const targetUser = await this.userService.getUser(receiverConversation.name);
			isAllowed = await this.chatService.canChat(
				client.data["username"],
				receiverConversation.name,
			);
			receiverConversation.name = senderUser.name;
			receiverConversation.image = senderUser.avatar;
			data.conversation["image"] = targetUser.avatar;
		} else {
			isAllowed = await this.channelService.canMessageSend(
				senderUser.name,
				data.conversation.name,
			);
		}

		if (!isAllowed) {
			throw NEED_PRIVILEGES(client.data["username"]);
		}

		const savedMessage = await this.chatService.saveMessage(data.message, data.conversation);
		receiverConversation.messages = [];

		// If it is a channel, the sender will receive the message with second emit.
		if (data.conversation.type == "private") {
			this.server.to(senderUser.name).emit(RECEIVED_MESSAGE, {
				message: savedMessage,
				conversation: data.conversation,
			});
			this.server.to(data.conversation.name).emit(RECEIVED_MESSAGE, {
				message: savedMessage,
				conversation: receiverConversation,
			});
			return;
		}

		// When the message sending to a channel.
		const sockets = await this.server.in(data.conversation.name).fetchSockets();
		for (const socket of sockets) {
			const canChat = await this.chatService.canChat(
				senderUser.name,
				socket.data["username"],
			);

			if (canChat) {
				socket.emit(RECEIVED_MESSAGE, {
					message: savedMessage,
					conversation: receiverConversation,
				});
			}
		}
	}

	/* Channel */
	@SocketEvent(CHANNEL_LEAVE)
	async channelLeave(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: ChannelLeaveDTO,
	) {
		const [leavedMember, channel] = await this.channelService.leaveChannel(
			client.data["username"],
			data.channelName,
		);

		this.server.to(channel.name).emit(LEAVED_CHANNEL, {
			member: leavedMember,
			channel,
		});
		this.server.in(leavedMember.user.name).socketsLeave(channel.name);
	}
	@SocketEvent(CHANNEL_DELETE)
	async channelDelete(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: ChannelDeleteDTO,
	) {
		const [channel, deletedBy] = await this.channelService.deleteChannel(
			data.channelName,
			client.data["username"],
		);

		const emitObject = { by: deletedBy, channel };

		if (channel.type == "private") {
			this.server.to(channel.name).emit(DELETED_CHANNEL, emitObject);
		} else {
			this.server.emit(DELETED_CHANNEL, emitObject);
		}

		this.server.in(data.channelName).socketsLeave(data.channelName);
	}
	@SocketEvent(CHANNEL_DENY)
	async channelDeny(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: ChannelDenyDTO,
	) {
		await this.channelService.denyInvite(client.data["username"], data.channelName);

		// Notify all clients of the user.
		// Other members of the channel, don't need
		// to know that.
		this.server.to(client.data["username"]).emit(DENIED_CHANNEL, {
			channelName: data.channelName,
		});
	}
	@SocketEvent(CHANNEL_APPROVE)
	async channelApprove(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: ChannelApproveDTO,
	) {
		// It is the same thing.
		await this.channelJoin(client, data);
	}
	@SocketEvent(CHANNEL_INVITE)
	async channelInvite(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: ChannelInviteDTO,
	) {
		const [invitedUser, inviter, channel] = await this.channelService.invite(
			data.username,
			client.data["username"],
			data.channelName,
		);

		const emitObject = {
			inviter,
			invitedUser,
			channel,
		};

		// Notify invited user.
		this.server.to(invitedUser.name).emit(INVITED_TO_CHANNEL, emitObject);

		// Notify all clients of the user who sent the invite.
		this.server.to(inviter.user.name).emit(SENT_INVITE_CHANNEL, emitObject);
	}
	@SocketEvent(CHANNEL_CREATE)
	async createChannel(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: ChannelCreateDTO,
	) {
		const channel = await this.channelService.createChannel(
			client.data["username"],
			data.channel,
			data.password,
		);

		const owner = channel.members[0];
		delete channel.members;

		if (channel.type != "private") {
			this.server.emit(NEW_CHANNEL_APPEARED, { owner, channel });
		}

		// Notify all clients of the user for the new created channel to join it.
		this.server.to(owner.user.name).emit(JOINED_CHANNEL, { member: owner, channel });
		this.server.to(owner.user.name).emit(CREATED_CHANNEL, { owner, channel });
		this.server.in(owner.user.name).socketsJoin(channel.name);
	}
	@SocketEvent(CHANNEL_KICK)
	async kickChannel(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: ChannelKickDTO,
	) {
		const [kicked, , channel] = await this.channelService.kickUser(
			data.username,
			client.data["username"],
			data.channelName,
		);

		this.server.to(channel.name).emit(LEAVED_CHANNEL, {
			channel,
			member: kicked,
		});
		this.server.in(kicked.user.name).socketsLeave(channel.name);
	}
	@SocketEvent(CHANNEL_MAKE_ADMIN)
	async makeAdminChannel(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: ChannelMakeAdminDTO,
	) {
		const [newAdmin, channel] = await this.channelService.makeAdmin(
			data.username,
			data.channelName,
			client.data["username"],
		);

		this.server.to(data.channelName).emit(MADE_ADMIN_CHANNEL, {
			member: newAdmin,
			channel,
		});
	}
	@SocketEvent(CHANNEL_TAKE_ADMIN)
	async takeAdminChannel(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: ChannelTakeAdminDTO,
	) {
		const [oldAdmin, channel] = await this.channelService.takeAdmin(
			data.username,
			data.channelName,
			client.data["username"],
		);

		this.server.to(data.channelName).emit(TAKEN_ADMIN_CHANNEL, {
			member: oldAdmin,
			channel,
		});
	}
	@SocketEvent(CHANNEL_BAN)
	async banChannel(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: ChannelBanDTO,
	) {
		const [bannedMember, channel] = await this.channelService.banMember(
			data.username,
			data.channelName,
			client.data["username"],
		);

		this.server.to(channel.name).emit(BANNED_CHANNEL, {
			member: bannedMember,
			channel,
		});
		this.server.in(bannedMember.user.name).socketsLeave(channel.name);
	}
	@SocketEvent(CHANNEL_UNBLOCK)
	async unblockChannel(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: ChannelUnblockDTO,
	) {
		const [unbannedMember, channel] = await this.channelService.unblockMember(
			data.username,
			data.channelName,
			client.data["username"],
		);

		this.server.in(unbannedMember.user.name).socketsJoin(channel.name);
		this.server.to(data.channelName).emit(UNBLOCKED_CHANNEL, {
			member: unbannedMember,
			channel,
		});
	}
	@SocketEvent(CHANNEL_JOIN)
	async channelJoin(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: ChannelJoinDTO,
	) {
		const [member, channel] = await this.channelService.joinChannel(
			client.data["username"],
			data.channelName,
			data.password,
		);

		// Take in user to the channel.
		this.server.in(member.user.name).socketsJoin(data.channelName);

		// Notify channel members.
		this.server.to(data.channelName).emit(JOINED_CHANNEL, {
			member,
			channel,
		});
	}
	@SocketEvent(CHANNEL_MUTE)
	async channelMute(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: ChannelMuteDTO,
	) {
		const [member, mutedBy, channel] = await this.channelService.muteMember(
			data.username,
			client.data["username"],
			data.channelName,
			data.minute,
		);

		this.server.to(data.channelName).emit(MUTED_CHANNEL, { by: mutedBy, member, channel });
	}
	@SocketEvent(CHANNEL_UNMUTE)
	async channelUnmute(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: ChannelUnmuteDTO,
	) {
		const [member, unmutedBy, channel] = await this.channelService.unmuteMember(
			data.username,
			client.data["username"],
			data.channelName,
		);

		this.server.to(data.channelName).emit(UNMUTED_CHANNEL, { by: unmutedBy, member, channel });
	}
	@SocketEvent(CHANNEL_EDIT)
	async channelEdit(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: ChannelEditDTO,
	) {
		const channel = await this.channelService.editChannel(
			client.data["username"],
			data.channelName,
			data.type,
			data.password,
		);
		this.server.to(data.channelName).emit(EDITED_CHANNEL, { channel });
	}

	/* Friend */
	@SocketEvent(FRIEND_REQUEST)
	async friendRequest(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: FriendRequestDTO,
	) {
		const user = await this.userService.getUser(client.data["username"]);
		const friend = await this.userService.getUser(data.friendName);
		await this.friendService.makeRequest(user.name, data.friendName);

		this.server.to(user.name).emit(OUTGOING_FRIEND_REQUEST, { friend });
		this.server.to(data.friendName).emit(INCOMING_FRIEND_REQUEST, { friend: user });
	}
	@SocketEvent(FRIEND_CANCEL_REQUEST)
	async friendCancelRequest(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: FriendRequestDTO,
	) {
		const user = await this.userService.getUser(client.data["username"]);
		const friend = await this.userService.getUser(data.friendName);

		await this.friendService.cancelRequest(user.name, data.friendName);

		this.server.to(user.name).emit(CANCELED_FRIEND_REQUEST, { friend });
		this.server.to(data.friendName).emit(CANCELED_FRIEND_REQUEST, { friend: user });
	}
	@SocketEvent(FRIEND_APPROVE)
	async friendApprove(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: FriendApproveDTO,
	) {
		const user = await this.userService.getUser(client.data["username"]);
		const friend = await this.userService.getUser(data.friendName);

		await this.friendService.approveRequest(user.name, data.friendName);

		this.server.to(user.name).emit(NOW_FRIEND, { friend });
		this.server.to(data.friendName).emit(NOW_FRIEND, { friend: user });

		this.activityService.setActivity(user.name, this.activityService.getActivity(user.name));
		this.activityService.setActivity(
			data.friendName,
			this.activityService.getActivity(data.friendName),
		);
	}
	@SocketEvent(FRIEND_DENY)
	async friendDeny(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: FriendDenyDTO,
	) {
		const user = await this.userService.getUser(client.data["username"]);
		const friend = await this.userService.getUser(data.friendName);

		await this.friendService.denyRequest(user.name, data.friendName);

		this.server.to(user.name).emit(DENIED_FRIEND, { friend });
		this.server.to(data.friendName).emit(DENIED_BY, { friend: user });
	}
	@SocketEvent(FRIEND_REMOVE)
	async friendRemove(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: FriendRemoveDTO,
	) {
		const user = await this.userService.getUser(client.data["username"]);
		const friend = await this.userService.getUser(data.friendName);

		await this.friendService.destroyFriendship(user.name, data.friendName);

		this.server.to(user.name).emit(REMOVED_FRIEND, { friend });
		this.server.to(data.friendName).emit(REMOVED_FRIEND, { friend: user });
	}

	/* User */
	@SocketEvent(BLOCK_USER)
	async blockUser(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: BlockUserDTO,
	) {
		const user = await this.userService.getUser(client.data["username"]);
		const blockedUser = await this.userService.blockUser(
			client.data["username"],
			data.username,
		);

		// I agree it is so ugly.
		try {
			await this.friendService.destroyFriendship(user.name, blockedUser.name);
		} catch (err) {}
		try {
			await this.friendService.denyRequest(user.name, blockedUser.name);
		} catch (err) {}
		try {
			await this.friendService.denyRequest(blockedUser.name, user.name);
		} catch (err) {}

		this.server.to(client.data["username"]).emit(BLOCKED_USER, { user: blockedUser });
		this.server.to(data.username).emit(BLOCKED_BY, { user });
	}
	@SocketEvent(UNBLOCK_USER)
	async unblockUser(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: UnblockUserDTO,
	) {
		const user = await this.userService.getUser(client.data["username"]);
		const unblockedUser = await this.userService.unblockUser(
			client.data["username"],
			data.username,
		);

		this.server.to(client.data["username"]).emit(UNBLOCKED_USER, { user: unblockedUser });
		this.server.to(data.username).emit(UNBLOCKED_BY, { user });
	}
	@SocketEvent(EDIT_USER)
	async editUser(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: EditUserDTO,
	) {
		const [oldUser, user] = await this.userService.updateUser(client.data["username"], data);

		const sockets = await this.server.fetchSockets();
		const newToken = jwt.sign({ username: user.name }, process.env.JWT_SECRET);

		for (const socket of sockets) {
			let token = undefined;
			if (socket.data["username"] == oldUser.name) {
				socket.data["username"] = user.name;
				socket.data["avatar"] = user.avatar;
				socket.leave(oldUser.name);
				socket.join(user.name);
				token = newToken;
			}
			socket.emit(USER_EDITED, {
				oldUser,
				newUser: user,
				newToken: token,
			});
		}
	}

	@SocketEvent(INVITE_MATCH)
	async inviteMatch(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: InviteMatchDTO,
	) {
		this.logger.log("fsafa" + data.username);
		this.server.to(data.username).emit(INVITED_TO_MATCH, {
			user: {
				name: client.data["username"],
				avatar: client.data["avatar"],
			},
		});
	}
}
