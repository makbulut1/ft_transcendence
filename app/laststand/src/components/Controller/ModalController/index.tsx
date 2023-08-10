import { useModalStore } from "@/stores/useModalStore";
import { cloneElement } from "react";
import { Portal } from "@/components/Controller/Portal";

export function ModalController() {
	const { modals } = useModalStore();

	return (
		<Portal rootId="modal-root">
			{modals.map((modal) =>
				cloneElement(modal.modal, {
					key: modal.id,
					id: modal.id,
					open: modal.isOpen,
				}),
			)}
		</Portal>
	);
}
