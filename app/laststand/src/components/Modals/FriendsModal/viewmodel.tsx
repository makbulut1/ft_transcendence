import { Dispatch, useEffect, useState } from "react";
import { User } from "@shared/models";
import {
	FRIEND_APPROVE,
	FRIEND_DENY,
	FRIEND_REMOVE,
	FRIEND_CANCEL_REQUEST,
	OUTGOING_FRIEND_REQUEST,
	WENT_WRONG,
	CANCELED_FRIEND_REQUEST,
	INCOMING_FRIEND_REQUEST,
	REMOVED_FRIEND,
	NOW_FRIEND,
	DENIED_FRIEND,
	BLOCKED_USER,
	BLOCK_USER,
	DENIED_BY,
	UNBLOCK_USER,
	UNBLOCKED_USER,
} from "@shared/socketEvents";
import { getFriends } from "@/api/raw/getFriends";
import { BaseModalProps } from "@/components/Modals/BaseModal/viewmodel";
import { toast } from "react-toastify";
import { useModalStore } from "@/stores/useModalStore";
import { AddFriendModal } from "@/components/Modals/AddFriendModal";
import { AxiosError } from "axios";
import { getIncomingRequests } from "@/api/raw/getIncomingRequests";
import { getWaitingRequests } from "@/api/raw/getWaitingRequests";
import { getBlockedUsers } from "@/api/raw/getBlockedUsers";
import { removeObject } from "@/utils/state/removeObject";
import { changeFields } from "@/utils/state/changeFields";
import { addObject } from "@/utils/state/addObject";
import { useSocialSocket } from "@/hooks/useSocket";
import { useSocketEvent } from "@/hooks/useSocketEvent";

export interface UserItem extends User {
	isLoading?: boolean;
}

export interface FriendsModalProps extends Omit<BaseModalProps, "children"> {}

export function useViewModel(props: FriendsModalProps) {
	const [selectedTab, setSelectedTab] = useState<number>(0);
	const [friends, setFriends] = useState<UserItem[]>([]);
	const [incomingRequests, setIncomingRequests] = useState<UserItem[]>([]);
	const [waitingRequests, setWaitingRequests] = useState<UserItem[]>([]);
	const [blockedUsers, setBlockedUsers] = useState<UserItem[]>([]);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { className, ...baseProps } = props;
	const social = useSocialSocket();
	const modal = useModalStore();

	function addUser(setter: Dispatch<React.SetStateAction<UserItem[]>>, item: UserItem) {
		addObject(setter, item);
	}
	function updateIsLoading(
		setter: Dispatch<React.SetStateAction<UserItem[]>>,
		friendName: string,
		isLoading: boolean,
	) {
		changeFields(setter, { name: friendName, isLoading }, "name");
	}

	async function load(loader: () => Promise<void>) {
		try {
			setIsLoading(true);
			await loader();
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error(err.response?.data.message);
			}
			console.error("Friends.API error:", err);
		} finally {
			setIsLoading(false);
		}
	}

	function loadFriends() {
		load(async () => {
			setFriends(await getFriends());
		});
	}
	function loadIncomingRequests() {
		load(async () => {
			setIncomingRequests(await getIncomingRequests());
		});
	}
	function loadWaitingRequests() {
		load(async () => {
			setWaitingRequests(await getWaitingRequests());
		});
	}
	function loadBlockedUsers() {
		load(async () => {
			setBlockedUsers(await getBlockedUsers());
		});
	}

	// UI events
	function handleTabChange(index: number) {
		setSelectedTab(index);
	}
	function handleFriendCancelRequestClick(friendName: string) {
		updateIsLoading(setWaitingRequests, friendName, true);
		social.emit(FRIEND_CANCEL_REQUEST, { friendName });
	}
	function handleFriendApproveClick(friendName: string) {
		updateIsLoading(setIncomingRequests, friendName, true);
		social.emit(FRIEND_APPROVE, { friendName });
	}
	function handleFriendDenyClick(friendName: string) {
		updateIsLoading(setIncomingRequests, friendName, true);
		social.emit(FRIEND_DENY, { friendName });
	}
	function handleFriendRemoveClick(friendName: string) {
		updateIsLoading(setFriends, friendName, true);
		social.emit(FRIEND_REMOVE, { friendName });
	}
	function handleFriendBlockClick(friendName: string) {
		updateIsLoading(setFriends, friendName, true);
		social.emit(BLOCK_USER, { username: friendName });
	}
	function handleUnblockUserClick(username: string) {
		updateIsLoading(setBlockedUsers, username, true);
		social.emit(UNBLOCK_USER, { username });
	}
	function handleFindFriendsClick() {
		modal.openModal(<AddFriendModal />);
	}

	function wentWrong(data: { error: any }) {
		setFriends((old) => old.map((x) => ({ ...x, isLoading: false })));
		setIncomingRequests((old) => old.map((x) => ({ ...x, isLoading: false })));
		setWaitingRequests((old) => old.map((x) => ({ ...x, isLoading: false })));
		setBlockedUsers((old) => old.map((x) => ({ ...x, isLoading: false })));

		console.error("Friends.Socket error:", data.error);
	}

	function outgoingFriendRequest(data: { friend: User }) {
		if (selectedTab == 2) {
			addUser(setWaitingRequests, data.friend);
		}
	}
	function incomingFriendRequest(data: { friend: User }) {
		if (selectedTab == 1) {
			addUser(setIncomingRequests, data.friend);
		}
	}
	function canceledFriendRequest(data: { friend: User }) {
		if (selectedTab == 2) {
			removeObject(setWaitingRequests, { name: data.friend.name });
		} else if (selectedTab == 1) {
			removeObject(setIncomingRequests, { name: data.friend.name });
		}
	}
	function removedFriend(data: { friend: User }) {
		if (selectedTab == 0) {
			removeObject(setFriends, { name: data.friend.name });
		}
	}
	function nowFriend(data: { friend: User }) {
		switch (selectedTab) {
			case 0:
				addUser(setFriends, data.friend);
				break;
			case 1:
				removeObject(setIncomingRequests, { name: data.friend.name });
				break;
			case 2:
				removeObject(setWaitingRequests, { name: data.friend.name });
				break;
		}
	}
	function deniedFriend(data: { friend: User }) {
		if (selectedTab == 1) {
			removeObject(setIncomingRequests, { name: data.friend.name });
		}
	}
	function deniedBy(data: { friend: User }) {
		if (selectedTab == 2) {
			removeObject(setWaitingRequests, { name: data.friend.name });
		}
	}
	function blockedUser(data: { user: User }) {
		switch (selectedTab) {
			case 0:
				removeObject(setFriends, { name: data.user.name });
				break;
			case 1:
				removeObject(setIncomingRequests, { name: data.user.name });
				break;
			case 3:
				addUser(setBlockedUsers, data.user);
				break;
		}
	}
	function unblockedUser(data: { user: User }) {
		if (selectedTab == 3) {
			removeObject(setBlockedUsers, { name: data.user.name });
		}
	}

	useSocketEvent(social, OUTGOING_FRIEND_REQUEST, outgoingFriendRequest, [selectedTab]);
	useSocketEvent(social, INCOMING_FRIEND_REQUEST, incomingFriendRequest, [selectedTab]);
	useSocketEvent(social, CANCELED_FRIEND_REQUEST, canceledFriendRequest, [selectedTab]);
	useSocketEvent(social, REMOVED_FRIEND, removedFriend, [selectedTab]);
	useSocketEvent(social, DENIED_FRIEND, deniedFriend, [selectedTab]);
	useSocketEvent(social, DENIED_BY, deniedBy, [selectedTab]);
	useSocketEvent(social, NOW_FRIEND, nowFriend, [selectedTab]);
	useSocketEvent(social, BLOCKED_USER, blockedUser, [selectedTab]);
	useSocketEvent(social, UNBLOCKED_USER, unblockedUser, [selectedTab]);
	useSocketEvent(social, WENT_WRONG, wentWrong);

	useEffect(() => {
		switch (selectedTab) {
			case 0:
				loadFriends();
				break;
			case 1:
				loadIncomingRequests();
				break;
			case 2:
				loadWaitingRequests();
				break;
			case 3:
				loadBlockedUsers();
				break;
		}
	}, [selectedTab]);

	return {
		handleFriendCancelRequestClick,
		handleFriendApproveClick,
		handleFriendDenyClick,
		handleFriendRemoveClick,
		handleFindFriendsClick,
		handleFriendBlockClick,
		handleTabChange,
		handleUnblockUserClick,
		selectedTab,
		friends,
		incomingRequests,
		waitingRequests,
		blockedUsers,
		isLoading,
		className,
		baseProps,
	};
}
