import { BaseModalProps } from "@/components/Modals/BaseModal/viewmodel";
import { useEffect, useState } from "react";
import { Channel, ChannelMember, User } from "@shared/models";
import {
	BLOCKED_BY,
	BLOCKED_USER,
	CHANNEL_INVITE,
	JOINED_CHANNEL,
	LEAVED_CHANNEL,
	SENT_INVITE_CHANNEL,
	UNBLOCKED_BY,
	UNBLOCKED_USER,
	WENT_WRONG,
} from "@shared/socketEvents";
import { toast } from "react-toastify";
import { getChannelInfo } from "@/api/raw/getChannelInfo";
import { AxiosError } from "axios";
import { getUsers } from "@/api/raw/getUsers";
import { useModalStore } from "@/stores/useModalStore";
import { changeFields } from "@/utils/state/changeFields";
import { addObject } from "@/utils/state/addObject";
import { removeObject } from "@/utils/state/removeObject";
import { useSocialSocket } from "@/hooks/useSocket";
import { useSocketEvent } from "@/hooks/useSocketEvent";

export interface UserItem extends User {
	type?: "invited";
	isLoading?: boolean;
}

export interface InviteModalProps extends Omit<BaseModalProps, "children"> {
	channelName: string;
}

export function useViewModel(props: InviteModalProps) {
	const [users, setUsers] = useState<UserItem[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { channelName, ...baseProps } = props;
	const social = useSocialSocket();
	const modal = useModalStore();

	// Functions
	async function load() {
		try {
			setIsLoading(true);
			const userList = await getUsers();
			const channelInfo = await getChannelInfo(channelName);

			setUsers(
				userList.filter((x) => !channelInfo.members?.find((y) => y.user.name == x.name)),
			);
			setIsLoading(false);
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error(err.response?.data.message);
			}
			modal.closeModal(props.id);
		}
	}
	function changeUserFields(username: string, fields: Partial<UserItem>) {
		changeFields(setUsers, { name: username, ...fields }, "name");
	}
	function addUser(user: User) {
		addObject(setUsers, user);
	}
	function removeUser(username: string) {
		removeObject(setUsers, { name: username });
	}

	// UI events
	function handleInviteClick(user: UserItem) {
		changeUserFields(user.name, { isLoading: true });
		social.emit(CHANNEL_INVITE, { channelName, username: user.name });
	}

	// Socket events
	function sentInviteChannel(data: { invitedUser: User }) {
		changeUserFields(data.invitedUser.name, { isLoading: false, type: "invited" });
	}
	function leavedChannel(data: { member: ChannelMember; channel: Channel }) {
		if (data.channel.name == channelName) {
			addUser(data.member.user);
		}
	}
	function joinedChannel(data: { member: ChannelMember; channel: Channel }) {
		if (data.channel.name == channelName) {
			removeUser(data.member.user.name);
		}
	}
	function blockedUser(data: { user: User }) {
		removeUser(data.user.name);
	}
	function unblockedUser(data: { user: User }) {
		addUser(data.user);
	}
	function wentWrong(data: { error: any }) {
		setUsers((old) => old.map((x) => ({ ...x, isLoading: false })));
		console.error("Invite.Socket error:", data.error);
	}

	useSocketEvent(social, LEAVED_CHANNEL, leavedChannel, [channelName]);
	useSocketEvent(social, JOINED_CHANNEL, joinedChannel, [channelName]);
	useSocketEvent(social, SENT_INVITE_CHANNEL, sentInviteChannel);
	useSocketEvent(social, BLOCKED_USER, blockedUser);
	useSocketEvent(social, BLOCKED_BY, blockedUser);
	useSocketEvent(social, UNBLOCKED_USER, unblockedUser);
	useSocketEvent(social, UNBLOCKED_BY, unblockedUser);
	useSocketEvent(social, WENT_WRONG, wentWrong);

	useEffect(() => {
		load();
	}, []);

	return {
		users,
		isLoading,
		baseProps,
		handleInviteClick,
	};
}
