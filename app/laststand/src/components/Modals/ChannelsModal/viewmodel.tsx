import { useEffect, useState } from "react";
import { Channel, ChannelMember, User } from "@shared/models";
import { getMyChannels } from "@/api/raw/getMyChannels";
import {
	CHANNEL_LEAVE,
	CHANNEL_APPROVE,
	CHANNEL_DENY,
	LEAVED_CHANNEL,
	WENT_WRONG,
	DELETED_CHANNEL,
	DENIED_CHANNEL,
	JOINED_CHANNEL,
	INVITED_TO_CHANNEL,
	UNBLOCKED_CHANNEL,
	BANNED_CHANNEL,
	CHANNEL_DELETE,
	EDITED_CHANNEL,
} from "@shared/socketEvents";
import { useModalStore } from "@/stores/useModalStore";
import { JoinChannelModal } from "@/components/Modals/JoinChannelModal";
import { ConfirmModal, NewChannelModal } from "@/components/Modals";
import { getMember } from "@/api/raw/getMember";
import { BaseModalProps } from "@/components/Modals/BaseModal/viewmodel";
import { getInvites } from "@/api/raw/getInvites";
import { toast } from "react-toastify";
import { removeObject } from "@/utils/state/removeObject";
import { AxiosError } from "axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSocialSocket } from "@/hooks/useSocket";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { LSError } from "@shared/types";

export type ChannelItemStatus = "invite" | "joined";

export interface ChannelItem extends Channel {
	status: ChannelItemStatus;
	isLoading?: boolean;
	invitedBy?: string;
}

export interface ChannelsModalProps extends Omit<BaseModalProps, "children"> {}

export function useViewModel(props: ChannelsModalProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [channels, setChannels] = useState<ChannelItem[]>([]);

	const { ...baseProps } = props;
	const auth = useAuthStore();
	const modal = useModalStore();
	const social = useSocialSocket();

	// Functions
	function updateChannel(channelName: string, fields: Partial<ChannelItem>) {
		return setChannels((old) => {
			if (!old.find((x) => x.name == channelName)) {
				return [
					{
						name: channelName,
						status: "joined", // Default values if not provided.
						type: "public",
						...fields,
					},
					...old,
				];
			}
			return old.map((item) => {
				if (item.name == channelName) {
					return {
						...item,
						...fields,
					};
				}
				return item;
			});
		});
	}
	function removeChannel(channelName: string) {
		removeObject(setChannels, { name: channelName });
	}
	async function loadChannels() {
		try {
			setIsLoading(true);

			const joinedChannels = await getMyChannels();
			const invitedChannels = await getInvites();

			setChannels([
				...invitedChannels.map<ChannelItem>((item) => ({
					name: item.channelName,
					type: "private",
					invitedBy: item.invitedBy,
					status: "invite",
				})),

				...joinedChannels.map<ChannelItem>((item) => ({
					...item,
					status: "joined",
				})),
			]);
			setIsLoading(false);
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error(err.response?.data.message);
			}
			console.error("Channels.API error:", err);
			modal.closeModal(props.id);
		}
	}

	// UI Events
	async function handleLeaveClick(channelName: string) {
		updateChannel(channelName, { isLoading: true });
		const memberInfo = await getMember(auth?.username!, channelName);

		if (memberInfo.type == "owner") {
			modal.openModal(
				<ConfirmModal
					onConfirmed={() => social.emit(CHANNEL_DELETE, { channelName })}
					onCanceled={() => updateChannel(channelName, { isLoading: false })}
				>
					<div>You are owner of the channel #{channelName}.</div>
					<div>If you leave from this channel, it will be deleted.</div>
					<div>Do you want to continue?</div>
				</ConfirmModal>,
			);
		} else {
			// NOTE: check and show warning for private and protected channels.
			social.emit(CHANNEL_LEAVE, { channelName });
		}
	}
	function handleJoinChannelClick() {
		modal.openModal(<JoinChannelModal />);
	}
	function handleCreateChannelClick() {
		modal.openModal(<NewChannelModal />);
	}
	function handleApproveClick(channelName: string) {
		updateChannel(channelName, { isLoading: true });
		social.emit(CHANNEL_APPROVE, { channelName });
	}
	function handleDenyClick(channelName: string) {
		updateChannel(channelName, { isLoading: true });
		social.emit(CHANNEL_DENY, { channelName });
	}

	// Socket events
	function leavedChannel(data: { member: ChannelMember; channel: Channel }) {
		if (data.member.user.name == auth?.username) {
			removeChannel(data.channel.name);
		}
	}
	function deletedChannel(data: { by: ChannelMember; channel: Channel }) {
		removeChannel(data.channel.name);
	}
	function deniedChannel(data: { channelName: string }) {
		removeChannel(data.channelName);
	}
	function joinedChannel(data: { member: ChannelMember; channel: Channel }) {
		if (auth?.username == data.member.user.name) {
			updateChannel(data.channel.name, {
				isLoading: false,
				status: "joined",
				type: data.channel.type,
			});
		}
	}
	function invitedToChannel(data: {
		inviter: ChannelMember;
		invitedUser: User;
		channel: Channel;
	}) {
		updateChannel(data.channel.name, {
			name: data.channel.name,
			type: data.channel.type,
			status: "invite",
		});
	}
	function unblockedChannel(data: { member: ChannelMember; channel: Channel }) {
		if (data.member.user.name == auth?.username) {
			updateChannel(data.channel.name, {
				name: data.channel.name,
				type: data.channel.type,
				status: "joined",
			});
		}
	}
	function bannedChannel(data: { member: ChannelMember; channel: Channel }) {
		if (data.member.user.name == auth?.username) {
			removeChannel(data.channel.name);
		}
	}
	function editedChannel(data: { channel: Channel }) {
		updateChannel(data.channel.name, {
			name: data.channel.name,
			type: data.channel.type,
			status: "joined",
		});
	}
	function wentWrong(data: { error: LSError }) {
		setChannels((old) => old.map((x) => ({ ...x, isLoading: false })));
		console.error("Channels.Socket error: ", data.error);
	}

	useSocketEvent(social, LEAVED_CHANNEL, leavedChannel, [auth]);
	useSocketEvent(social, DELETED_CHANNEL, deletedChannel, [channels]);
	useSocketEvent(social, DENIED_CHANNEL, deniedChannel);
	useSocketEvent(social, JOINED_CHANNEL, joinedChannel, [auth]);
	useSocketEvent(social, UNBLOCKED_CHANNEL, unblockedChannel, [auth, channels]);
	useSocketEvent(social, BANNED_CHANNEL, bannedChannel, [auth, channels]);
	useSocketEvent(social, INVITED_TO_CHANNEL, invitedToChannel, [auth]);
	useSocketEvent(social, EDITED_CHANNEL, editedChannel, [channels]);
	useSocketEvent(social, WENT_WRONG, wentWrong, [channels]);

	useEffect(() => {
		loadChannels();
	}, []);

	return {
		baseProps,
		isLoading,
		channels,
		handleLeaveClick,
		handleApproveClick,
		handleDenyClick,
		handleJoinChannelClick,
		handleCreateChannelClick,
	};
}
