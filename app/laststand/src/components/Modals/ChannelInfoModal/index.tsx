import { BaseModal } from "@/components/Modals";
import { ChannelInfoContext, ChannelInfoModalProps, useViewModel } from "./viewmodel";
import { BeatLoader } from "react-spinners";
import { Participant } from "./components/Participant";

export function ChannelInfoModal(props: ChannelInfoModalProps) {
	const viewModel = useViewModel(props);

	function renderOperations() {
		if (viewModel.userInfo?.type == "member") {
			return;
		}

		const invite = (
			<button
				key="invite"
				onClick={viewModel.handleInviteFriendClick}
				className="bg-green-600 hover:bg-green-700 text-white text-sm h-[40px]"
			>
				Invite
			</button>
		);
		const ownerActions = (
			<div key="owner" className="flex gap-2">
				<button
					onClick={viewModel.handleDeleteChannelClick}
					className="bg-red-600 hover:bg-red-700 text-white text-sm h-[40px]"
				>
					Delete channel
				</button>
				<button
					onClick={viewModel.handleEditChannelClick}
					className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm h-[40px]"
				>
					Edit channel
				</button>
			</div>
		);

		if (viewModel.userInfo?.type == "admin" || viewModel.userInfo?.type == "owner") {
			if (viewModel.channelInfo?.type == "private") {
				if (viewModel.userInfo.type == "owner") {
					return [ownerActions, invite];
				}
				return [invite];
			}
			if (viewModel.userInfo.type == "owner") {
				return ownerActions;
			}
		}
	}

	function renderParticipants() {
		if (!viewModel.channelInfo?.members || !viewModel.userInfo) {
			return;
		}

		return (
			<ChannelInfoContext.Provider
				value={{
					channelName: props.channelName,
					userInfo: viewModel.userInfo,
				}}
			>
				<ul className="flex flex-col gap-3 w-full max-h-[200px] overflow-x-hidden overflow-y-auto">
					{viewModel.channelInfo?.members?.map((member) => (
						<Participant key={member.user.name} member={member} />
					))}
				</ul>
			</ChannelInfoContext.Provider>
		);
	}

	return (
		<BaseModal {...viewModel.baseProps}>
			{viewModel.isLoading ? (
				<div className="flex justify-center w-full">
					<BeatLoader color="black" />
				</div>
			) : (
				<div className="flex flex-col text-black gap-5 w-[80vw] sm:w-[400px] md:w-[500px] max-h-[300px]">
					<div className="flex gap-4">
						<div className="flex items-center justify-center w-[50px] h-[50px] text-[30px] shadow-lg rounded-full bg-slate-400">
							#
						</div>
						<div className="flex flex-col">
							<div>{viewModel.channelInfo?.name}</div>
							<div className="text-slate-500">
								{viewModel.channelInfo?.members?.length} participant
							</div>
						</div>
					</div>
					<div className="flex justify-between items-center">
						<div>Participants:</div>
						<div className="flex gap-2">{renderOperations()}</div>
					</div>
					{renderParticipants()}
				</div>
			)}
		</BaseModal>
	);
}
