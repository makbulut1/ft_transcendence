import { BaseModal } from "@/components/Modals";
import { EditChannelModalProps, useViewModel } from "./viewmodel";
import { FormProvider } from "@/contexts/FormContext";
import { BeatLoader } from "react-spinners";
import { InputTextField } from "@/components/HookForm/InputTextField";
import { InputRadioGroup } from "@/components/HookForm/InputRadioGroup";

export function EditChannelModal(props: EditChannelModalProps) {
	const viewModel = useViewModel(props);

	return (
		<BaseModal onClose={viewModel.onClose} {...viewModel.baseProps}>
			<FormProvider methods={viewModel.form} onSubmit={viewModel.handleSubmitClick}>
				<div className="text-black flex flex-col gap-3">
					<div>
						<div className="mt-2">Channel type:</div>

						<InputRadioGroup
							disabled={viewModel.isProcessing}
							className="p-4"
							name="type"
						>
							<InputRadioGroup.Option
								className="p-3 flex items-center justify-center"
								value="public"
							>
								Public
							</InputRadioGroup.Option>
							<InputRadioGroup.Option
								className="p-3 flex items-center justify-center"
								value="protected"
							>
								Protected
							</InputRadioGroup.Option>
							<InputRadioGroup.Option
								className="p-3 flex items-center justify-center"
								value="private"
							>
								Private
							</InputRadioGroup.Option>
						</InputRadioGroup>
					</div>

					{viewModel.channelType == "protected" && (
						<div>
							<div className="mb-2">New password:</div>
							<InputTextField
								disabled={viewModel.isProcessing}
								placeholder="**********"
								name="password"
							/>
						</div>
					)}

					<button
						disabled={viewModel.isProcessing}
						type="submit"
						className="bg-slate-300 hover:bg-slate-500 hover:text-white disabled:hover:bg-slate-300"
					>
						{viewModel.isProcessing ? (
							<BeatLoader className="self-center" color="gray" />
						) : (
							"Save"
						)}
					</button>
				</div>
			</FormProvider>
		</BaseModal>
	);
}
