import * as yup from "yup";
import { BaseModalProps } from "@/components/Modals/BaseModal/viewmodel";
import { useForm } from "react-hook-form";
import { Channel, ChannelType } from "@shared/models";
import { useEffect, useState } from "react";
import { useModalStore } from "@/stores/useModalStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { CHANNEL_EDIT, EDITED_CHANNEL, WENT_WRONG } from "@shared/socketEvents";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { getChannelInfo } from "@/api/raw/getChannelInfo";
import { useSocialSocket } from "@/hooks/useSocket";
import { useSocketEvent } from "@/hooks/useSocketEvent";

interface EditChannelForm {
	type: ChannelType;
	password?: string;
}

export interface EditChannelModalProps extends Omit<BaseModalProps, "children"> {
	channelName: string;
}

export function useViewModel(props: EditChannelModalProps) {
	const schema = yup.object().shape({
		type: yup.mixed().oneOf(["public", "protected", "private"]),
		password: yup.string().nullable().default(''),
	});

	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const { onClose: onCloseProp, channelName, ...baseProps } = props;
	const form = useForm<EditChannelForm>({ resolver: yupResolver(schema) });
	const modal = useModalStore();
	const social = useSocialSocket();
	const channelType = form.watch("type");

	// Functions
	async function loadChannel() {
		setIsProcessing(true);
		try {
			const channel = await getChannelInfo(channelName);
			setIsProcessing(false);

			form.setValue("type", channel.type);
		} catch (err) {
			if (err instanceof AxiosError) {
				toast.error(err.response?.data.message);
			}
			console.error("EditChannel.API error:", err);
			modal.closeModal(props.id);
		}
	}

	// Handlers
	function onClose() {
		if (!isProcessing) {
			if (props.id && !onCloseProp) {
				modal.closeModal(props.id);
				return;
			}
			onCloseProp?.(props.id);
		}
	}

	// UI events
	const handleSubmitClick = form.handleSubmit(async (values) => {
		setIsProcessing(true);
		social.emit(CHANNEL_EDIT, {
			channelName,
			...values,
		});
	});

	// Socket events
	function editedChannel(data: { channel: Channel }) {
		if (data.channel.name == channelName) {
			modal.closeModal(props.id);
		}
	}
	function wentWrong(data: { error: any }) {
		setIsProcessing(false);
		console.error("EditChannel.Socket error:", data.error);
	}

	useSocketEvent(social, WENT_WRONG, wentWrong);
	useSocketEvent(social, EDITED_CHANNEL, editedChannel, [channelName]);

	/* useEffect(() => {
		if (channelType == "protected") {
			form.register("password");
		} else {
			form.unregister("password");
		}
	}, [channelType, form.register, form.unregister]); */

	useEffect(() => {
		loadChannel();
	}, []);

	return {
		isProcessing,
		baseProps,
		form,
		channelType,
		onClose,
		handleSubmitClick,
	};
}
