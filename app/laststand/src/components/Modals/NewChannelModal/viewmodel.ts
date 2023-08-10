import * as yup from "yup";
import { useModalStore } from "@/stores/useModalStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Channel } from "@shared/models";
import { useEffect, useState } from "react";
import { BaseModalProps } from "@/components/Modals/BaseModal/viewmodel";
import { CHANNEL_CREATE, CREATED_CHANNEL, WENT_WRONG } from "@shared/socketEvents";
import { useSocialSocket } from "@/hooks/useSocket";
import { useSocketEvent } from "@/hooks/useSocketEvent";

interface NewChannelForm {
	channel: Channel;
	password?: string;
}

export interface NewChannelModalProps extends Omit<BaseModalProps, "children"> {}

export function useViewModel(props: NewChannelModalProps) {
	const schema = yup.object().shape({
		channel: yup.object().shape({
			name: yup
				.string()
				.required("Enter a channel name")
				.min(5, "Minimum 5 character")
				.max(30, "Channel name cannot be longer than 30"),
			type: yup.mixed().oneOf(["public", "protected", "private"]),
		}),
		password: yup.string().nullable().default(undefined).min(1, "Minimum password length is 1"),
	});

	const [isChannelCreating, setIsChannelCreating] = useState<boolean>(false);

	const form = useForm<NewChannelForm>({ resolver: yupResolver(schema) });
	const modal = useModalStore();
	const social = useSocialSocket();
	const channelType = form.watch("channel.type");

	const { onClose: onCloseProp, ...baseProps } = props;

	// Handlers
	function onClose() {
		if (!isChannelCreating) {
			if (props.id && !onCloseProp) {
				modal.closeModal(props.id);
				return;
			}
			onCloseProp?.(props.id);
		}
	}

	// UI events
	const handleSubmitClick = form.handleSubmit(async (values) => {
		setIsChannelCreating(true);
		social.emit(CHANNEL_CREATE, {
			channel: values.channel,
			password: values.channel.type == "protected" ? values.password : undefined,
		});
	});

	// Socket events
	function createdChannel() {
		modal.closeModal(props.id);
	}
	function wentWrong(data: { error: any }) {
		setIsChannelCreating(false);
		console.error("NewChannel.Socket error:", data.error);
	}

	useSocketEvent(social, CREATED_CHANNEL, createdChannel);
	useSocketEvent(social, WENT_WRONG, wentWrong);

	useEffect(() => {
		if (channelType == "protected") {
			form.register("password");
		} else {
			form.unregister("password");
		}
	}, [channelType, form.register, form.unregister]);

	return {
		isChannelCreating,
		baseProps,
		form,
		channelType,
		onClose,
		handleSubmitClick,
	};
}
