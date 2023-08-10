import { BaseModal } from "@/components/Modals";
import { NewChannelModalProps, useViewModel } from "./viewmodel";
import { BeatLoader } from "react-spinners";
import { FormProvider } from "@/contexts/FormContext";
import { InputRadioGroup } from "@/components/HookForm/InputRadioGroup";
import { InputTextField } from "@/components/HookForm/InputTextField";

export function NewChannelModal(props: NewChannelModalProps) {
	const viewModel = useViewModel(props);

	function renderChannelName() {
		return (
			<div>
				<div className="mb-2">Channel name:</div>
				<div className="flex w-full gap-3">
					<span className="text-xl font-bold">#</span>
					<InputTextField disabled={viewModel.isChannelCreating} name="channel.name" />
				</div>
			</div>
		);
	}

	function renderChannelType() {
		return (
			<div>
				<div className="mt-2">Channel type:</div>
				<InputRadioGroup
					disabled={viewModel.isChannelCreating}
					className="p-4"
					name="channel.type"
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
		);
	}

	function renderPassword() {
		if (viewModel.channelType == "protected") {
			return (
				<div>
					<div className="mb-2">Password:</div>
					<InputTextField disabled={viewModel.isChannelCreating} name="password" />
				</div>
			);
		}
	}

	return (
		<BaseModal {...viewModel.baseProps} onClose={viewModel.onClose}>
			<FormProvider methods={viewModel.form} onSubmit={viewModel.handleSubmitClick}>
				<div className="text-black flex flex-col gap-3">
					{renderChannelName()}
					{renderChannelType()}
					{renderPassword()}
					<button
						disabled={viewModel.isChannelCreating}
						type="submit"
						className="p-3 transition-all duration-200 bg-slate-300 rounded-lg hover:cursor-pointer hover:bg-slate-500 hover:text-white shadow-sm disabled:hover:bg-slate-300 disabled:hover:cursor-default"
					>
						{viewModel.isChannelCreating ? (
							<BeatLoader className="self-center" color="gray" />
						) : (
							"Create"
						)}
					</button>
				</div>
			</FormProvider>
		</BaseModal>
	);
}
