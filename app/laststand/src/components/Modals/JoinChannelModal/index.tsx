import { BaseModal } from "@/components/Modals";
import { Icon } from "@iconify/react";
import { ChannelItem, JoinChannelModalProps, useViewModel } from "./viewmodel";
import { BeatLoader } from "react-spinners";
import { TextField } from "@/components/UI/TextField";
import { IconNotifier } from "@/components/UI/IconNotifier";

export function JoinChannelModal(props: JoinChannelModalProps) {
	const viewModel = useViewModel(props);

	function renderPasswordField(channel: ChannelItem) {
		return (
			<div className="flex gap-2 items-center justify-between flex-1">
				<TextField
					className="w-full flex-1"
					placeholder="Channel password..."
					type="password"
					value={channel.password}
					onChange={(value) => viewModel.handleChannelPasswordInput(channel, value)}
				/>
				<button
					onClick={() => viewModel.handleEnterPasswordClick(channel)}
					className="bg-green-600 hover:bg-green-700 w-[40px] h-[40px] p-2"
				>
					<Icon icon="material-symbols:check" fontSize="30px" />
				</button>
			</div>
		);
	}

	function renderJoinButton(channel: ChannelItem) {
		function renderInside() {
			if (channel.isLoading) {
				return <BeatLoader color="white" />;
			}

			if (channel.status == "joined") {
				return "Joined";
			}

			return "Join";
		}

		return (
			<button
				disabled={channel.status != "notyet"}
				onClick={() => viewModel.handleJoinClick(channel)}
				className="bg-green-600 hover:bg-green-700 text-white"
			>
				{renderInside()}
			</button>
		);
	}

	function renderChannel(channel: ChannelItem) {
		return (
			<li
				key={channel.name}
				className="items-center h-[60px] p-2 w-full rounded-lg bg-slate-300 flex justify-between gap-3"
			>
				<div className="font-bold flex items-center gap-3 w-[50%]">
					<div className="text-ellipsis overflow-hidden">#{channel.name} </div>
					{channel.type == "protected" ? <Icon icon="material-symbols:lock" /> : null}
				</div>
				{channel.status == "pass"
					? renderPasswordField(channel)
					: renderJoinButton(channel)}
			</li>
		);
	}

	function renderList() {
		if (viewModel.isLoading) {
			return <BeatLoader color="gray" />;
		}

		if (viewModel.availableChannels.length == 0) {
			return (
				<IconNotifier
					message="There aren't any channel those you can join..."
					icon="arcticons:shrug"
				/>
			);
		}

		return (
			<ul className="w-[80vw] sm:w-[400px] md:w-[500px] max-h-[300px] flex flex-col text-black gap-3 overflow-y-auto">
				{viewModel.availableChannels.map((channel) => renderChannel(channel))}
			</ul>
		);
	}

	return (
		<BaseModal {...viewModel.baseProps}>
			<div className="text-xl text-black font-bold mb-5">Join a channel</div>
			{renderList()}
		</BaseModal>
	);
}
