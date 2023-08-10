import { BaseModal } from "@/components/Modals";
import { InviteModalProps, UserItem, useViewModel } from "./viewmodel";
import { BeatLoader } from "react-spinners";
import { IconNotifier } from "@/components/UI/IconNotifier";
import { Avatar } from "@/components/UI/Avatar";

export function InviteModal(props: InviteModalProps) {
	const viewModel = useViewModel(props);

	function renderInviteButtonContent(user: UserItem) {
		if (user.isLoading) {
			return <BeatLoader color="white" />;
		} else if (user.type === "invited") {
			return "Invited";
		}

		return "Invite";
	}

	function renderUser(user: UserItem) {
		return (
			<li
				key={user.name}
				className="flex justify-between rounded-lg bg-slate-200 p-3 items-center"
			>
				<div className="flex items-center gap-3">
					<Avatar user={user} />
					<div className="text-ellipsis overflow-hidden text-sm sm:text-md">
						{user.name}
					</div>
				</div>
				<button
					disabled={user.isLoading || user.type === "invited"}
					onClick={() => viewModel.handleInviteClick(user)}
					className="bg-green-600 hover:bg-green-700 text-white p-2 text-sm sm:text-md"
				>
					{renderInviteButtonContent(user)}
				</button>
			</li>
		);
	}

	function renderList() {
		if (viewModel.isLoading) {
			return (
				<div className="flex items-center justify-center">
					<BeatLoader color="black" />
				</div>
			);
		}

		if (viewModel.users.length == 0) {
			return (
				<IconNotifier message="Looks like everyone is already here huh?" icon="fa:group" />
			);
		}

		return (
			<ul className="w-[300px] lg:w-[400px] max-h-[200px] md:max-h-[300px] flex flex-col text-black gap-3 overflow-y-auto">
				{viewModel.users.map((user) => renderUser(user))}
			</ul>
		);
	}

	return (
		<BaseModal {...viewModel.baseProps}>
			<div className="text-xl text-black font-bold mb-5">Invite to channel</div>
			{renderList()}
		</BaseModal>
	);
}
