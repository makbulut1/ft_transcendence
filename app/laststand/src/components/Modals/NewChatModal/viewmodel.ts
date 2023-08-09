import { getUsers } from "@/api/raw/getUsers";
import { BaseModalProps } from "@/components/Modals/BaseModal/viewmodel";
import { useModalStore } from "@/stores/useModalStore";
import { Conversation, User } from "@shared/models";
import { useState } from "react";
import { useQuery } from "react-query";
import { BLOCKED_BY, BLOCKED_USER, UNBLOCKED_BY, UNBLOCKED_USER } from "@shared/socketEvents";
import { removeObject } from "@/utils/state/removeObject";
import { addObject } from "@/utils/state/addObject";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { useSocialSocket } from "@/hooks/useSocket";

export interface NewChatModalProps extends Omit<BaseModalProps, "children"> {
	onSelected?: (chat: Conversation) => void;
}

export function useViewModel(props: NewChatModalProps) {
	const [users, setUsers] = useState<User[]>([]);
	const modal = useModalStore();
	const social = useSocialSocket();

	const { onSelected, ...baseProps } = props;
	const { isFetching: isLoading } = useQuery({
		queryKey: "newChat/users",
		refetchOnWindowFocus: false,
		queryFn: () => getUsers(),
		onSuccess(data: User[]) {
			setUsers(data);
		},
		onError(err) {
			if (err instanceof AxiosError) {
				toast.error(err.response?.data.message);
			}
			console.error("NewChat.API error:", err);
			modal.closeModal(props.id);
		},
	});

	// UI events
	function handleItemClick(username: string) {
		onSelected?.({
			name: username,
			type: "private",
		});
		modal.closeModal(props.id);
	}

	// Socket events
	function blocked(data: { user: User }) {
		removeObject(setUsers, { name: data.user.name });
	}
	function unblocked(data: { user: User }) {
		addObject(setUsers, data.user);
	}

	useSocketEvent(social, BLOCKED_USER, blocked);
	useSocketEvent(social, BLOCKED_BY, blocked);
	useSocketEvent(social, UNBLOCKED_BY, unblocked);
	useSocketEvent(social, UNBLOCKED_USER, unblocked);

	return {
		baseProps,
		users,
		isLoading,
		handleItemClick,
	};
}
