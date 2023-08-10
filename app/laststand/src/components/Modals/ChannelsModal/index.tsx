import { BaseModal } from "@/components/Modals";
import { BeatLoader } from "react-spinners";
import { Icon } from "@iconify/react";
import { ChannelItem, ChannelsModalProps, useViewModel } from "./viewmodel";
import { IconNotifier } from "@/components/UI/IconNotifier";
import { ChannelType } from "@shared/models";

export function ChannelsModal(props: ChannelsModalProps) {
	const viewModel = useViewModel(props);

	function renderChannelIcon(type: ChannelType) {
		switch (type) {
			case "protected":
				return <Icon icon="material-symbols:lock" />;
			case "private":
				return <Icon icon="iconamoon:eye-off-duotone" />;
			case "public":
				return null;
		}
	}

	function renderChannelAction(channel: ChannelItem) {
		switch (channel.status) {
			case "joined":
				return (
					<button
						onClick={() => viewModel.handleLeaveClick(channel.name)}
						className="bg-red-600 hover:bg-red-700 text-white p-2"
					>
						{channel.isLoading ? <BeatLoader color="white" /> : "Leave"}
					</button>
				);
			case "invite":
				return (
					<div className="flex gap-1 text-white">
						{channel.isLoading ? (
							<button className="bg-yellow-600">
								<BeatLoader color="white" />
							</button>
						) : (
							<>
								<button
									onClick={() => viewModel.handleApproveClick(channel.name)}
									className="bg-green-600 hover:bg-green-700 w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] p-2"
								>
									<Icon icon="material-symbols:check" fontSize="30px" />
								</button>
								<button
									onClick={() => viewModel.handleDenyClick(channel.name)}
									className="bg-red-600 hover:bg-red-700 w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] p-2"
								>
									<Icon icon="gridicons:cross" fontSize="30px" />
								</button>
							</>
						)}
					</div>
				);
		}
	}

	function renderChannel(channel: ChannelItem) {
		return (
			<li
				key={channel.name}
				className="items-center h-[60px] p-2 rounded-lg gap-3 bg-slate-300 flex justify-between"
			>
				<div className="font-bold flex items-center gap-1 w-full">
					<div className="text-ellipsis flex-1 overflow-hidden">#{channel.name}</div>
					{renderChannelIcon(channel.type)}
					{channel.status == "invite" && (
						<div className="text-[10px] sm:text-[14px] italic font-normal">
							Invited by <span className="font-bold">@{channel.invitedBy}</span>
						</div>
					)}
				</div>
				{renderChannelAction(channel)}
			</li>
		);
	}

	function renderChannels() {
		if (viewModel.isLoading) {
			return <BeatLoader color="gray" />;
		}

		if (viewModel.channels.length == 0) {
			return (
				<IconNotifier
					icon="icon-park:fishing"
					message="Looks like you haven't joined any channel yet."
				/>
			);
		}

		return (
			<ul className="max-h-[280px] flex flex-col text-black gap-3 overflow-y-auto">
				{viewModel.channels.map((channel) => renderChannel(channel))}
			</ul>
		);
	}

	function renderActions() {
		return (
			<div className="flex gap-3 justify-end text-black">
				<button
					onClick={viewModel.handleJoinChannelClick}
					className="bg-slate-200 hover:bg-slate-300 gap-3"
				>
					<Icon fontSize="22px" icon="fluent-mdl2:join-online-meeting" />
					Join a channel
				</button>

				<button
					onClick={viewModel.handleCreateChannelClick}
					className="bg-slate-200 hover:bg-slate-300 gap-3"
				>
					<Icon fontSize="22px" icon="material-symbols:group-add" />
					Create a channel
				</button>
			</div>
		);
	}

	return (
		<BaseModal {...viewModel.baseProps}>
			<div className="w-[80vw] sm:w-[400px] md:w-[500px]">
				<div className="text-xl text-black font-bold mb-3">Channels</div>
				<div className="flex flex-col gap-3">
					{renderChannels()}
					{renderActions()}
				</div>
			</div>
		</BaseModal>
	);
}
