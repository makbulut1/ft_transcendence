import { useModalStore } from "@/stores/useModalStore";
import { MouseEvent, ReactNode } from "react";

export interface BaseModalProps {
	id?: string;
	className?: string;
	children: ReactNode;
	open?: boolean;
	onClose?: (id?: string) => void;
}

export function useViewModel(props: BaseModalProps) {
	const modal = useModalStore();

	function handleOnClose() {
		if (props.id && !props.onClose) {
			modal.closeModal(props.id);
			return;
		}

		if (props.onClose) {
			props.onClose(props.id);
		}
	}

	function handleContentClick(event: MouseEvent<HTMLElement>) {
		event.stopPropagation();
	}

	return {
		handleContentClick,
		handleOnClose,
	};
}
