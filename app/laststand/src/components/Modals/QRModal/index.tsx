import { BaseModal } from "@/components/Modals";
import { QRModalProps, useViewModel } from "./viewmodel";

export function QRModal(props: QRModalProps) {
	const viewModel = useViewModel();

	return (
		<BaseModal {...props}>
			<div className="text-black flex flex-col">
				<div className="w-[400px]">
					Please use an authenticator application such as{" "}
					<a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_US&pli=1">
						Google Authenticator
					</a>{" "}
					and scan QR code to access your two factor codes.
				</div>
				<img className="w-7/12 self-center" src={viewModel.imageData} />
			</div>
		</BaseModal>
	);
}
