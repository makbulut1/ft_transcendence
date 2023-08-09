import { ChannelMember } from "@shared/models";
import { useContext, useState } from "react";
import {
	BANNED_CHANNEL,
	CHANNEL_BAN,
	CHANNEL_KICK,
	CHANNEL_MAKE_ADMIN,
	CHANNEL_TAKE_ADMIN,
	CHANNEL_UNBLOCK,
	CHANNEL_UNMUTE,
	MADE_ADMIN_CHANNEL,
	MUTED_CHANNEL,
	TAKEN_ADMIN_CHANNEL,
	UNBLOCKED_CHANNEL,
	UNMUTED_CHANNEL,
	WENT_WRONG,
} from "@shared/socketEvents";
import { useModalStore } from "@/stores/useModalStore";
import { MuteModal } from "@/components/Modals/MuteModal";
import { ChannelInfoContext } from "../../viewmodel";
import { useSocialSocket } from "@/hooks/useSocket";
import { useSocketEvent } from "@/hooks/useSocketEvent";

export interface ActionMenuProps {
	member: ChannelMember;
}

export function useViewModel(props: ActionMenuProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const context = useContext(ChannelInfoContext);
	const social = useSocialSocket();
	const modal = useModalStore();

	// UI events
	function handleKickClick() {
		setIsLoading(true);
		social.emit(CHANNEL_KICK, {
			username: props.member.user.name,
			channelName: context?.channelName,
		});
	}
	function handleMakeAdmin() {
		setIsLoading(true);
		social.emit(CHANNEL_MAKE_ADMIN, {
			username: props.member.user.name,
			channelName: context?.channelName,
		});
	}
	function handleTakeAdmin() {
		setIsLoading(true);
		social.emit(CHANNEL_TAKE_ADMIN, {
			username: props.member.user.name,
			channelName: context?.channelName,
		});
	}
	function handleBan() {
		setIsLoading(true);
		social.emit(CHANNEL_BAN, {
			username: props.member.user.name,
			channelName: context?.channelName,
		});
	}
	function handleUnblock() {
		setIsLoading(true);
		social.emit(CHANNEL_UNBLOCK, {
			username: props.member.user.name,
			channelName: context?.channelName,
		});
	}
	function handleMute() {
		modal.openModal(<MuteModal channelName={context?.channelName!} member={props.member} />);
	}
	function handleUnmute() {
		setIsLoading(true);
		social.emit(CHANNEL_UNMUTE, {
			username: props.member.user.name,
			channelName: context?.channelName,
		});
	}

	// Socket events
	function wentWrong(/* data: { error: any } */) {
		setIsLoading(false);
	}
	function operationCompleted(data: { member: ChannelMember }) {
		if (data.member.user.name == props.member.user.name) {
			// If completed operation is belongs to this member...
			setIsLoading(false);
		}
	}

	useSocketEvent(social, WENT_WRONG, wentWrong);
	useSocketEvent(social, MADE_ADMIN_CHANNEL, operationCompleted);
	useSocketEvent(social, TAKEN_ADMIN_CHANNEL, operationCompleted);
	useSocketEvent(social, BANNED_CHANNEL, operationCompleted);
	useSocketEvent(social, UNBLOCKED_CHANNEL, operationCompleted);
	useSocketEvent(social, UNMUTED_CHANNEL, operationCompleted);
	useSocketEvent(social, MUTED_CHANNEL, operationCompleted);

	return {
		isLoading,
		context,
		handleUnmute,
		handleMute,
		handleKickClick,
		handleMakeAdmin,
		handleTakeAdmin,
		handleUnblock,
		handleBan,
	};
}
