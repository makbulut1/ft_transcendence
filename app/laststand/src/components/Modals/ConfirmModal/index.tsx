import { BaseModal } from "@/components/Modals";
import { ConfirmModalProps, useViewModel } from "./viewmodel";

export function ConfirmModal(props: ConfirmModalProps) {
	const viewModel = useViewModel(props);

	return (
		<BaseModal onClose={viewModel.handleClose} {...viewModel.baseProps}>
			<div className="flex flex-col gap-3 text-black">
				{props.children}
				<div className="flex gap-3 text-white justify-end">
					<button
						onClick={viewModel.handleConfirm}
						className="bg-green-600 hover:bg-green-700"
					>
						{props.confirmContent ?? "Confirm"}
					</button>
					<button
						onClick={viewModel.handleCancel}
						className="bg-red-600 hover:bg-red-700"
					>
						{props.cancelContent ?? "Cancel"}
					</button>
				</div>
			</div>
		</BaseModal>
	);
}
