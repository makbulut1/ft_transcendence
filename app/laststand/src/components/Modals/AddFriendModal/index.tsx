import { BaseModal } from "@/components/Modals";
import { AddFriendModalProps, UserItem, useViewModel } from "./viewmodel";
import { BeatLoader } from "react-spinners";
import { Avatar } from "@/components/UI/Avatar";
import { IconNotifier } from "@/components/UI/IconNotifier";

export function AddFriendModal(props: AddFriendModalProps) {
	const viewModel = useViewModel(props);

	function renderActions(user: UserItem) {
		if (user.isLoading) {
			return <BeatLoader color="white" />;
		}

		const request = (
			<button
				key="request"
				disabled={user.type == "requested"}
				onClick={() => viewModel.handleRequestClick(user.name)}
				className="bg-green-600 hover:bg-green-700 text-white p-1 w-[40px] h-[40px] sm:w-[70px] sm:h-[50px]"
			>
				{user.type == "requested" ? "Request sent" : "Request"}
			</button>
		);

		const block = (
			<button
				key="block"
				disabled={user.type == "blocked"}
				onClick={() => viewModel.handleBlockClick(user.name)}
				className="bg-rose-600 hover:bg-rose-700 text-white p-1"
			>
				{user.type == "blocked" ? "Blocked" : "Block"}
			</button>
		);

		if (user.type == "blocked") {
			return [block];
		}

		return [request, block];
	}

	function renderUserItem(user: UserItem) {
		return (
			<li
				key={user.name}
				className="w-full flex items-center justify-between bg-slate-300 p-3 rounded-md"
			>
				<div className="flex gap-3 items-center">
					<Avatar user={user} />
					<div className="text-sm">{user.name}</div>
				</div>
				<div className="flex gap-3 text-[10px] sm:text-[16px]">{renderActions(user)}</div>
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
			return <IconNotifier icon="bi:person-x-fill" message="There is nothing to see" />;
		}

		return (
			<ul className="flex flex-col text-black gap-3 overflow-y-auto w-full">
				{viewModel.users.map((user) => renderUserItem(user))}
			</ul>
		);
	}

	return (
		<BaseModal {...viewModel.baseProps}>
			<div className="flex items-center justify-center w-[250px] sm:w-[300px] max-h-[400px] flex-col gap-3">
				<div className="self-start text-xl text-black font-bold mb-5">Find friend</div>
				{renderList()}
			</div>
		</BaseModal>
	);
}
