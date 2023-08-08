import { useEffect, useState } from "react";
import { Channel, ChannelMember } from "@shared/models";
import { getAvailableChannels } from "@/api/raw/getAvailableChannels";
import {
	CHANNEL_JOIN,
	DELETED_CHANNEL,
	JOINED_CHANNEL,
	LEAVED_CHANNEL,
	NEW_CHANNEL_APPEARED,
	WENT_WRONG,
} from "@shared/socketEvents";
import { BaseModalProps } from "@/components/Modals/BaseModal/viewmodel";
import { toast } from "react-toastify";
import { changeFields } from "@/utils/state/changeFields";
import { useModalStore } from "@/stores/useModalStore";
import { AxiosError } from "axios";
import { removeObject } from "@/utils/state/removeObject";
import { addObject } from "@/utils/state/addObject";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSocialSocket } from "@/hooks/useSocket";
import { useSocketEvent } from "@/hooks/useSocketEvent";

export type ChannelItemStatus = "joined" | "notyet" | "pass";

export interface ChannelItem extends Channel {
	status: ChannelItemStatus;
	isLoading?: boolean;
	password?: string;
}

export interface JoinChannelModalProps extends Omit<BaseModalProps, "children"> {}

export function useViewModel(props: JoinChannelModalProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [availableChannels, setAvailableChannels] = useState<ChannelItem[]>([]);
	const { ...baseProps } = props;

	const auth = useAuthStore();
	const social = useSocialSocket();
	const modal = useModalStore();

	// Functions
	function changeChannelFields(channelName: string, fields: Partial<ChannelItem>) {
		changeFields(setAvailableChannels, { name: channelName, ...fields }, "name");
	}
	async function loadAvailableChannels() {
		try {
			setIsLoading(true);
			const result = await getAvailableChannels();

			setAvailableChannels(
				result.map<ChannelItem>((item) => ({
					...item,
					status: "notyet",
					password: "",
				})),
			);
			setIsLoading(false);
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error(err.response?.data.message);
			}
			console.error("Join.API error:", err);
			modal.closeModal(props.id);
		}
	}
	function joinChannel(channel: ChannelItem) {
		changeChannelFields(channel.name, { isLoading: true });
		social.emit(CHANNEL_JOIN, {
			channelName: channel.name,
			password: channel.password,
		});
	}

	// UI events
	function handleJoinClick(channel: ChannelItem) {
		if (channel.type == "public") {
			joinChannel(channel);
		} else if (channel.type == "protected") {
			changeChannelFields(channel.name, { status: "pass" });
		}
	}
	function handleEnterPasswordClick(channel: ChannelItem) {
		joinChannel(channel);
	}
	function handleChannelPasswordInput(channel: ChannelItem, value: string) {
		changeChannelFields(channel.name, { password: value });
	}

	// Socket events
	function joinedChannel(data: { member: ChannelMember; channel: Channel }) {
		if (auth?.username == data.member.user.name) {
			changeChannelFields(data.channel.name, { isLoading: false, status: "joined" });
		}
	}
	function leavedChannel(data: { channel: Channel; member: ChannelMember }) {
		// If we leaved from this channel, now it has been joinable.
		if (auth?.username == data.member.user.name && data.channel.type != "private") {
			changeFields(
				setAvailableChannels,
				{
					name: data.channel.name,
					type: data.channel.type,
					status: "notyet",
				},
				"name",
				true,
			);
		}
	}
	function deletedChannel(data: { by: ChannelMember; channel: Channel }) {
		removeObject(setAvailableChannels, { name: data.channel.name });
	}
	function newChannelAppeared(data: { owner: ChannelMember; channel: Channel }) {
		addObject(setAvailableChannels, {
			name: data.channel.name,
			type: data.channel.type,
			status: "notyet",
		});
	}
	function wentWrong(data: { error: any }) {
		console.error("Join.Socket error:", data.error);
		setAvailableChannels(old => old.map(x => ({ ...x, isLoading: false })));
	}

	useSocketEvent(social, JOINED_CHANNEL, joinedChannel, [auth]);
	useSocketEvent(social, LEAVED_CHANNEL, leavedChannel, [auth]);
	useSocketEvent(social, DELETED_CHANNEL, deletedChannel);
	useSocketEvent(social, NEW_CHANNEL_APPEARED, newChannelAppeared);
	useSocketEvent(social, WENT_WRONG, wentWrong);

	useEffect(() => {
		loadAvailableChannels();
	}, []);

	return {
		availableChannels,
		baseProps,
		isLoading,
		handleJoinClick,
		handleChannelPasswordInput,
		handleEnterPasswordClick,
	};
}
