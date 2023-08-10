import * as yup from "yup";
import { getProfile } from "@/api/raw/getProfile";
import { BaseModalProps } from "@/components/Modals/BaseModal/viewmodel";
import { useAuthStore } from "@/stores/useAuthStore";
import { Profile, User } from "@shared/models";
import {
	BLOCKED_BY,
	BLOCKED_USER,
	BLOCK_USER,
	CANCELED_FRIEND_REQUEST,
	DENIED_BY,
	DENIED_FRIEND,
	EDIT_USER,
	FRIEND_APPROVE,
	FRIEND_CANCEL_REQUEST,
	FRIEND_DENY,
	FRIEND_REMOVE,
	FRIEND_REQUEST,
	INCOMING_FRIEND_REQUEST,
	INVITE_MATCH,
	NOW_FRIEND,
	OUTGOING_FRIEND_REQUEST,
	REMOVED_FRIEND,
	UNBLOCKED_USER,
	UNBLOCK_USER,
	USER_EDITED,
	WENT_WRONG,
} from "@shared/socketEvents";
import { LSError } from "@shared/types";
import { ERR_ALREADY_REQUESTED } from "@shared/errorCodes";
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import { useModalStore } from "@/stores/useModalStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { QRModal } from "@/components/Modals/QRModal";
import { useSocialSocket } from "@/hooks/useSocket";
import { useSocketEvent } from "@/hooks/useSocketEvent";

interface UserEditForm {
	name: string;
	twoFactorAuthEnabled: boolean;
	avatar?: File;
}

export interface ProfileModalProps extends Omit<BaseModalProps, "children"> {
	username?: string;
	actions?: ReactNode;
	interact?: boolean;
}

export function useViewModel(props: ProfileModalProps) {
	const schema = yup.object().shape({
		name: yup.string().min(3, "Minimum length is 3").max(30, "Maximum length is 30"),
		twoFactorAuthEnabled: yup.boolean(),
	});

	const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [profile, setProfile] = useState<Profile>();
	const [editMode, setEditMode] = useState<boolean>(false);
	const form = useForm<UserEditForm>({ resolver: yupResolver(schema) });
	const avatarFileInputRef = useRef<HTMLInputElement | null>(null);
	const modal = useModalStore();
	const auth = useAuthStore();
	const social = useSocialSocket();
	const formAvatarValue = form.watch("avatar");
	const { username, ...baseProps } = props;

	// Functions
	async function loadProfile() {
		try {
			setIsFetching(true);
			const data = await getProfile(username);
			setProfile(data);
			setIsFetching(false);
			form.reset({
				name: data.name,
				twoFactorAuthEnabled: data.twoFactorAuthEnabled ?? false,
			});
			setEditMode(localStorage.getItem("firstLogin") === "true");
			localStorage.removeItem("firstLogin");
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error(err.response?.data.message);
				console.error("Profile.API error:", err.response?.data);
			} else {
				console.error("Profile.API error:", err);
			}

			modal.closeModal(props.id);
		}
	}
	function updateProfile(fields: Partial<Profile>) {
		setProfile((old) => {
			if (!old) {
				return;
			}
			return {
				...old,
				...fields,
			};
		});
	}

	// UI events
	function handleFriendRequestClick() {
		setIsActionLoading(true);
		social.emit(FRIEND_REQUEST, { friendName: username });
	}
	function handleFriendRemoveClick() {
		setIsActionLoading(true);
		social.emit(FRIEND_REMOVE, { friendName: username });
	}
	function handleCancelRequestClick() {
		setIsActionLoading(true);
		social.emit(FRIEND_CANCEL_REQUEST, { friendName: username });
	}
	function handleApproveClick() {
		setIsActionLoading(true);
		social.emit(FRIEND_APPROVE, { friendName: username });
	}
	function handleDenyClick() {
		setIsActionLoading(true);
		social.emit(FRIEND_DENY, { friendName: username });
	}
	function handleBlockClick() {
		setIsActionLoading(true);
		social.emit(BLOCK_USER, { username });
	}
	function handleUnblockClick() {
		setIsActionLoading(true);
		social.emit(UNBLOCK_USER, { username });
	}
	function handleEditClick() {
		form.reset();
		setEditMode(true);
	}
	function handleInviteGameClick() {
		social.emit(INVITE_MATCH, { username: profile?.name });
		toast.info("Match invite has been sent.");
	}
	function handleCancelEditClick() {
		setEditMode(false);
	}
	function handleAvatarUploadClick() {
		avatarFileInputRef.current?.click();
	}
	function handleAvatarUploaded(event: ChangeEvent<HTMLInputElement>) {
		form.setValue("avatar", event?.target?.files?.[0]);
	}
	const handleSaveClick = form.handleSubmit((values) => {
		setIsActionLoading(true);

		if (values.avatar) {
			const reader = new FileReader();
			reader.readAsDataURL(values.avatar);
			reader.onload = () => {
				social.emit(EDIT_USER, {
					...values,
					avatar: reader.result,
				});
			};
		} else {
			social.emit(EDIT_USER, values);
		}
	});

	// Socket events
	function outgoingFriendRequest(data: { friend: User }) {
		if (data.friend.name == username) {
			setIsActionLoading(false);
			updateProfile({
				friendRequest: "outgoing",
			});
		}
	}
	function removedFriend(data: { friend: User }) {
		if (data.friend.name == username) {
			setIsActionLoading(false);
			updateProfile({
				friendRequest: undefined,
				isFriend: false,
			});
		}
	}
	function canceledFriendRequest(data: { friend: User }) {
		if (data.friend.name == username) {
			setIsActionLoading(false);
			updateProfile({
				friendRequest: undefined,
			});
		}
	}
	function incomingFriendRequest(data: { friend: User }) {
		if (data.friend.name == username) {
			updateProfile({
				friendRequest: "incoming",
			});
		}
	}
	function deniedBy(data: { friend: User }) {
		if (data.friend.name == username) {
			updateProfile({
				friendRequest: undefined,
			});
		}
	}
	function deniedFriend(data: { friend: User }) {
		if (data.friend.name == username) {
			setIsActionLoading(false);
			updateProfile({
				friendRequest: undefined,
			});
		}
	}
	function nowFriend(data: { friend: User }) {
		if (data.friend.name == username) {
			setIsActionLoading(false);
			updateProfile({
				isFriend: true,
			});
		}
	}
	function blockedUser(data: { user: User }) {
		if (data.user.name == username) {
			setIsActionLoading(false);
			updateProfile({
				isBlocked: true,
			});
		}
	}
	function unblockedUser(data: { user: User }) {
		if (data.user.name == username) {
			setIsActionLoading(false);
			updateProfile({
				isBlocked: false,
			});
		}
	}
	function blockedBy(data: { user: User }) {
		if (data.user.name == username) {
			modal.closeModal(props.id);
		}
	}
	function userEdited(data: { oldUser: User; newUser: User; newToken?: string }) {
		let name = username ?? auth.username;
		if (data.oldUser.name == name) {
			const twoFactorAuthEnabled = form.getValues("twoFactorAuthEnabled");

			updateProfile({
				name: data.newUser.name,
				avatar: data.newUser.avatar,
				twoFactorAuthEnabled,
			});

			if (name == auth.username) {
				auth.login(
					data.newUser.name,
					data.newToken ?? auth.token ?? "",
					data.newUser.avatar,
				);
			}
			setIsActionLoading(false);
			setEditMode(false);

			if (twoFactorAuthEnabled) {
				modal.openModal(<QRModal />);
			}
		}
	}
	function wentWrong(data: { error: string | LSError }) {
		if (typeof data.error != "string") {
			if (data.error.code == ERR_ALREADY_REQUESTED) {
			}
		}
		setIsActionLoading(false);
	}

	useSocketEvent(social, OUTGOING_FRIEND_REQUEST, outgoingFriendRequest, [username]);
	useSocketEvent(social, INCOMING_FRIEND_REQUEST, incomingFriendRequest, [username]);
	useSocketEvent(social, CANCELED_FRIEND_REQUEST, canceledFriendRequest, [username]);
	useSocketEvent(social, DENIED_BY, deniedBy, [username]);
	useSocketEvent(social, DENIED_FRIEND, deniedFriend, [username]);
	useSocketEvent(social, NOW_FRIEND, nowFriend, [username]);
	useSocketEvent(social, REMOVED_FRIEND, removedFriend, [username]);
	useSocketEvent(social, BLOCKED_USER, blockedUser, [username]);
	useSocketEvent(social, BLOCKED_BY, blockedBy, [username]);
	useSocketEvent(social, UNBLOCKED_USER, unblockedUser, [username]);
	useSocketEvent(social, USER_EDITED, userEdited, [username, auth, form]);
	useSocketEvent(social, WENT_WRONG, wentWrong);

	useEffect(() => {
		loadProfile();
	}, []);

	useEffect(() => {
		if (editMode) {
			form.register("name");
			form.register("twoFactorAuthEnabled");
			form.reset({
				name: profile?.name,
				twoFactorAuthEnabled: profile?.twoFactorAuthEnabled,
			});
		} else {
			form.unregister(["name", "twoFactorAuthEnabled"]);
		}
	}, [editMode, form.register, form.unregister]);

	return {
		auth,
		profile,
		isFetching,
		baseProps,
		isActionLoading,
		editMode,
		form,
		avatarFileInputRef,
		formAvatarValue,
		handleAvatarUploaded,
		handleAvatarUploadClick,
		handleCancelEditClick,
		handleEditClick,
		handleSaveClick,
		handleBlockClick,
		handleInviteGameClick,
		handleUnblockClick,
		handleApproveClick,
		handleDenyClick,
		handleCancelRequestClick,
		handleFriendRemoveClick,
		handleFriendRequestClick,
	};
}
