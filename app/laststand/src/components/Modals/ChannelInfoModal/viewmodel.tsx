import { createContext, useEffect, useState } from "react";
import { Channel, ChannelMember, User } from "@shared/models";
import { getChannelInfo } from "@/api/raw/getChannelInfo";
import { useModalStore } from "@/stores/useModalStore";
import { ConfirmModal } from "@/components/Modals";
import {
	BANNED_CHANNEL,
	CHANNEL_DELETE,
	DELETED_CHANNEL,
	EDITED_CHANNEL,
	JOINED_CHANNEL,
	LEAVED_CHANNEL,
	MADE_ADMIN_CHANNEL,
	MUTED_CHANNEL,
	TAKEN_ADMIN_CHANNEL,
	UNBLOCKED_CHANNEL,
	UNMUTED_CHANNEL,
	WENT_WRONG,
} from "@shared/socketEvents";
import { toast } from "react-toastify";
import { BaseModalProps } from "@/components/Modals/BaseModal/viewmodel";
import { InviteModal } from "@/components/Modals/InviteModal";
import { EditChannelModal } from "@/components/Modals/EditChannelModal";
import { AxiosError } from "axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSocialSocket } from "@/hooks/useSocket";
import { useSocketEvent } from "@/hooks/useSocketEvent";

export interface ChannelInfoModalProps extends Omit<BaseModalProps, "children"> {
	channelName: string;
}

export const ChannelInfoContext = createContext<{
	channelName: string;
	userInfo?: ChannelMember;
} | null>(null);

export function useViewModel(props: ChannelInfoModalProps) {
	const { className, channelName, ...baseProps } = props;
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [channelInfo, setChannelInfo] = useState<Channel>();
	const [userInfo, setUserInfo] = useState<ChannelMember>();
	const modal = useModalStore();
	const auth = useAuthStore();
	const social = useSocialSocket();

	// Functions
	async function loadInfo() {
		try {
			setIsLoading(true);
			const info = await getChannelInfo(channelName);
			setUserInfo(info.members?.find((x) => x.user.name == auth?.username));
			setChannelInfo(info);
			setIsLoading(false);
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error(err.response?.data.message);
			}
			console.error("ChannelInfo.API error:", err);
			quitModal();
		}
	}
	function quitModal() {
		modal.closeModal("delete_confirm");
		modal.closeModal(props.id);
	}
	function addParticipant(user: User) {
		setChannelInfo((old) => ({
			...old!,
			members: [
				...(old!.members ?? []),
				{
					user,
					banned: false,
					type: "member",
				},
			],
		}));
	}
	function removeParticipant(name: string) {
		setChannelInfo((old) => ({
			...old!,
			members: (old!.members ?? []).filter((x) => x.user.name != name),
		}));
	}

	// UI events
	function handleDeleteChannelClick() {
		modal.openModal(
			<ConfirmModal
				onConfirmed={() => {
					setIsLoading(true);
					social.emit(CHANNEL_DELETE, { channelName });
				}}
			>
				<div>Are you sure to delete #{channelInfo?.name}?</div>
				<div>Channel conversation will be lost.</div>
			</ConfirmModal>,
			"delete_confirm",
		);
	}
	function handleInviteFriendClick() {
		modal.openModal(<InviteModal channelName={channelInfo?.name!} />);
	}
	function handleEditChannelClick() {
		modal.openModal(<EditChannelModal channelName={channelInfo?.name!} />);
	}

	// Socket events
	function leavedChannel(data: { member: ChannelMember; channel: Channel }) {
		if (data.channel.name == channelName) {
			if (data.member.user.name == auth?.username) {
				quitModal();
			} else {
				removeParticipant(data.member.user.name);
			}
		}
	}
	function joinedChannel(data: { member: ChannelMember; channel: Channel }) {
		if (data.channel.name == channelName) {
			addParticipant(data.member.user);
		}
	}
	function deletedChannel(data: { by: ChannelMember; channel: Channel }) {
		if (data.channel.name == channelName) {
			quitModal();
		}
	}
	function updateMember(data: { member: ChannelMember; channel: Channel }) {
		if (data.member.user.name == userInfo?.user.name) {
			// This client banned from the channel
			if (data.member.banned) {
				quitModal();
			} else {
				setUserInfo((old) => ({
					...old!,
					...data.member,
				}));
			}
		}
		setChannelInfo((old) => {
			const info = Object.assign({}, old);
			info.members ??= [];

			const index = info.members.findIndex((x) => x.user.name == data.member.user.name);
			if (index != -1) {
				info.members[index] = {
					...info.members[index],
					...data.member,
				};
			}

			return info;
		});
	}
	function editedChannel(data: { channel: Channel }) {
		if (data.channel.name == channelInfo?.name) {
			loadInfo();
		}
	}
	function wentWrong(data: { error: any }) {
		console.error("ChannelInfo.Socket error:", data.error);
	}

	useSocketEvent(social, LEAVED_CHANNEL, leavedChannel, [auth, channelName]);
	useSocketEvent(social, JOINED_CHANNEL, joinedChannel, [channelName]);
	useSocketEvent(social, DELETED_CHANNEL, deletedChannel, [channelName]);
	useSocketEvent(social, MADE_ADMIN_CHANNEL, updateMember, [userInfo]);
	useSocketEvent(social, TAKEN_ADMIN_CHANNEL, updateMember, [userInfo]);
	useSocketEvent(social, BANNED_CHANNEL, updateMember, [userInfo]);
	useSocketEvent(social, UNBLOCKED_CHANNEL, updateMember, [userInfo]);
	useSocketEvent(social, MUTED_CHANNEL, updateMember, [userInfo]);
	useSocketEvent(social, UNMUTED_CHANNEL, updateMember, [userInfo]);
	useSocketEvent(social, EDITED_CHANNEL, editedChannel, [channelInfo]);
	useSocketEvent(social, WENT_WRONG, wentWrong);

	useEffect(() => {
		loadInfo();
	}, []);

	return {
		channelInfo,
		isLoading,
		className,
		userInfo,
		baseProps,
		handleInviteFriendClick,
		handleDeleteChannelClick,
		handleEditChannelClick,
	};
}
