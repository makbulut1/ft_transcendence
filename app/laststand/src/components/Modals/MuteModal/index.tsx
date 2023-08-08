import { BaseModal } from "@/components/Modals";
import { MuteModalProps, useViewModel } from "./viewmodel";
import { FormProvider } from "@/contexts/FormContext";
import { InputTextField } from "@/components/HookForm/InputTextField";
import { BeatLoader } from "react-spinners";

export function MuteModal(props: MuteModalProps) {
	const viewModel = useViewModel(props);

	return (
		<BaseModal {...viewModel.baseProps}>
			<FormProvider methods={viewModel.form} onSubmit={viewModel.handleSubmitClick}>
				{viewModel.isLoading ? (
					<BeatLoader color="black" />
				) : (
					<div className="text-black flex flex-col gap-3">
						<div>
							<div className="mb-2">Mute time (min):</div>
							<InputTextField type="number" name="minute" />
						</div>
						<button className="bg-slate-300 hover:bg-slate-500" type="submit">
							Mute
						</button>
					</div>
				)}
			</FormProvider>
		</BaseModal>
	);
}
