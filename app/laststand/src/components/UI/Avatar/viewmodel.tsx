import { Status, User } from "@shared/models";
import { MouseEvent, useEffect, useState } from "react";
import {
	BLOCKED_BY,
	FRIEND_IN_GAME,
	FRIEND_OFFLINE,
	FRIEND_ONLINE,
	REMOVED_FRIEND,
} from "@shared/socketEvents";
import { getStatus } from "@/api/raw/getStatus";
import { useModalStore } from "@/stores/useModalStore";
import { ProfileModal } from "@/components/Modals/ProfileModal";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { useSocialSocket } from "@/hooks/useSocket";

export interface AvatarProps {
	user: User;
}

export function useViewModel(props: AvatarProps) {
	const [status, setStatus] = useState<Status | undefined>(props.user.status);
	const modal = useModalStore();
	const social = useSocialSocket();

	// UI events
	function handleClick(e: MouseEvent<HTMLImageElement>) {
		e.stopPropagation();
		modal.openModal(<ProfileModal username={props.user.name} />);
	}

	// Socket events
	function friendOnline(data: { friendName: string }) {
		if (data.friendName == props.user.name) {
			setStatus("online");
		}
	}
	function friendOffline(data: { friendName: string }) {
		if (data.friendName == props.user.name) {
			setStatus("offline");
		}
	}
	function friendInGame(data: { friendName: string }) {
		if (data.friendName == props.user.name) {
			setStatus("ingame");
		}
	}
	function removedFriend(/* data: { friend: User } */) {
		setStatus(undefined);
	}

	useSocketEvent(social, FRIEND_ONLINE, friendOnline, [props.user]);
	useSocketEvent(social, FRIEND_OFFLINE, friendOffline, [props.user]);
	useSocketEvent(social, FRIEND_IN_GAME, friendInGame, [props.user]);
	useSocketEvent(social, REMOVED_FRIEND, removedFriend);
	useSocketEvent(social, BLOCKED_BY, removedFriend);

	useEffect(() => {
		if (props.user.name) {
			getStatus(props.user.name).then((friendStatus) => {
				setStatus(friendStatus);
			});
		}
	}, []);

	return {
		status,
		handleClick,
	};
}
