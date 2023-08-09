import * as yup from "yup";
import { BaseModalProps } from "@/components/Modals/BaseModal/viewmodel";
import { Channel, ChannelMember } from "@shared/models";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useModalStore } from "@/stores/useModalStore";
import { CHANNEL_MUTE, MUTED_CHANNEL, WENT_WRONG } from "@shared/socketEvents";
import { useSocialSocket } from "@/hooks/useSocket";
import { useSocketEvent } from "@/hooks/useSocketEvent";

interface MuteForm {
	minute: number;
}

export interface MuteModalProps extends Omit<BaseModalProps, "children"> {
	member: ChannelMember;
	channelName: string;
}

export function useViewModel(props: MuteModalProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { member, channelName, ...baseProps } = props;
	const schema = yup.object().shape({
		minute: yup
			.number()
			.min(1, "Minute must be greater than zero")
			.typeError("Value must be number"),
	});

	const form = useForm<MuteForm>({ resolver: yupResolver(schema) });
	const modal = useModalStore();
	const social = useSocialSocket();

	// UI events
	const handleSubmitClick = form.handleSubmit(async (values) => {
		setIsLoading(true);
		social.emit(CHANNEL_MUTE, {
			channelName,
			username: member.user.name,
			minute: values.minute,
		});
	});

	// Socket events
	function wentWrong(data: { error: any }) {
		setIsLoading(false);
		console.error("Mute.Socket error:", data.error);
	}
	function mutedChannel(data: { member: ChannelMember; channel: Channel }) {
		if (data.member.user.name == member.user.name) {
			modal.closeModal(props.id);
		}
	}

	useSocketEvent(social, MUTED_CHANNEL, mutedChannel, [member]);
	useSocketEvent(social, WENT_WRONG, wentWrong);

	return {
		handleSubmitClick,
		isLoading,
		baseProps,
		form,
	};
}
