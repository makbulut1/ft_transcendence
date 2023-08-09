import { getPossibleFriends } from "@/api/raw/getPossibleFriends";
import { BaseModalProps } from "@/components/Modals/BaseModal/viewmodel";
import { useQuery } from "react-query";
import { User } from "@shared/models";
import { useState } from "react";
import {
	BLOCKED_BY,
	BLOCKED_USER,
	BLOCK_USER,
	CANCELED_FRIEND_REQUEST,
	DENIED_BY,
	DENIED_FRIEND,
	FRIEND_REQUEST,
	INCOMING_FRIEND_REQUEST,
	OUTGOING_FRIEND_REQUEST,
	REMOVED_FRIEND,
	UNBLOCKED_BY,
	UNBLOCKED_USER,
	WENT_WRONG,
} from "@shared/socketEvents";
import { removeObject } from "@/utils/state/removeObject";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useSocialSocket } from "@/hooks/useSocket";
import { useSocketEvent } from "@/hooks/useSocketEvent";

export interface AddFriendModalProps extends Omit<BaseModalProps, "children"> {}

export type UserItemType = "requested" | "notyet" | "blocked";

export interface UserItem extends User {
	type: UserItemType;
	isLoading?: boolean;
}

export function useViewModel(props: AddFriendModalProps) {
	const [users, setUsers] = useState<UserItem[]>([]);
	const { ...baseProps } = props;
	const social = useSocialSocket();
	const { isFetching: isLoading } = useQuery({
		queryKey: "newChat/friends",
		refetchOnWindowFocus: false,
		queryFn: () => getPossibleFriends(),
		onSuccess(data: User[]) {
			setUsers(
				data.map((x) => ({
					...x,
					type: "notyet",
				})),
			);
		},
		onError(err) {
			if (err instanceof AxiosError) {
				toast.error(err.response?.data.message);
			}
		},
	});

	// Functions
	function changeUserField(username: string, fields: Partial<UserItem>) {
		/* changeFields(setUsers, {
			name: username,
			avatar: fields?.avatar,
			type: fields?.type ?? 'notyet'
		}, 'name', true); */
		setUsers((old) => {
			const newList = [...old];
			const index = newList.findIndex((x) => x.name == username);

			if (index == -1) {
				newList.push({
					name: username,
					isLoading: false,
					avatar: fields.avatar ?? "",
					type: fields.type ?? "notyet",
				});
			} else {
				newList[index] = {
					...newList[index],
					...fields,
				};
			}

			return newList;
		});
	}
	function removeUser(username: string) {
		removeObject(setUsers, { name: username });
	}

	// UI events
	function handleRequestClick(username: string) {
		changeUserField(username, { isLoading: true });
		social.emit(FRIEND_REQUEST, { friendName: username });
	}
	function handleBlockClick(username: string) {
		changeUserField(username, { isLoading: true });
		social.emit(BLOCK_USER, { username });
	}

	// Socket events
	function outgoingFriendRequest(data: { friend: User }) {
		changeUserField(data.friend.name, {
			isLoading: false,
			type: "requested",
			avatar: data.friend.avatar,
		});
	}
	function incomingFriendRequest(data: { friend: User }) {
		removeUser(data.friend.name);
	}
	function notAFriend(data: { friend: User }) {
		changeUserField(data.friend.name, {
			isLoading: false,
			type: "notyet",
			avatar: data.friend.avatar, // If this user is not in the list, we need to add it.
		});
	}
	function blockedBy(data: { user: User }) {
		removeUser(data.user.name);
	}
	function blockedUser(data: { user: User }) {
		changeUserField(data.user.name, { isLoading: false, type: "blocked" });
	}
	function unblockedUser(data: { user: User }) {
		changeUserField(data.user.name, {
			isLoading: false,
			type: "notyet",
			avatar: data.user.avatar,
		});
	}
	function wentWrong(data: { error: any }) {
		console.error("AddFriend.Socket error:", data.error);
	}

	useSocketEvent(social, OUTGOING_FRIEND_REQUEST, outgoingFriendRequest, [users]);
	useSocketEvent(social, INCOMING_FRIEND_REQUEST, incomingFriendRequest, [users]);
	useSocketEvent(social, CANCELED_FRIEND_REQUEST, notAFriend, [users]);
	useSocketEvent(social, REMOVED_FRIEND, notAFriend, [users]);
	useSocketEvent(social, DENIED_FRIEND, notAFriend, [users]);
	useSocketEvent(social, DENIED_BY, notAFriend, [users]);
	useSocketEvent(social, BLOCKED_BY, blockedBy, [users]);
	useSocketEvent(social, BLOCKED_USER, blockedUser, [users]);
	useSocketEvent(social, UNBLOCKED_USER, unblockedUser, [users]);
	useSocketEvent(social, UNBLOCKED_BY, unblockedUser, [users]);
	useSocketEvent(social, WENT_WRONG, wentWrong, [users]);

	return {
		baseProps,
		users,
		isLoading,
		handleRequestClick,
		handleBlockClick,
	};
}
