import { BaseModalProps } from "@/components/Modals/BaseModal/viewmodel";
import { useModalStore } from "@/stores/useModalStore";
import { ReactNode } from "react";

export interface ConfirmModalProps extends BaseModalProps {
	confirmContent?: ReactNode;
	cancelContent?: ReactNode;
	onConfirmed?: () => void;
	onCanceled?: () => void;
}

export function useViewModel(props: ConfirmModalProps) {
	const { onClose, children, onCanceled, onConfirmed, ...baseProps } = props;
	const modal = useModalStore();

	function handleClose() {
		if (props.id && !props.onClose) {
			onCanceled?.();
			modal.closeModal(props.id);
			return;
		}
		onCanceled?.();
		onClose?.(props.id);
	}

	function handleConfirm() {
		onConfirmed?.();
		modal.closeModal(props.id);
	}

	function handleCancel() {
		onCanceled?.();
		modal.closeModal(props.id);
	}

	return {
		baseProps,
		children,
		handleCancel,
		handleConfirm,
		handleClose,
	};
}
