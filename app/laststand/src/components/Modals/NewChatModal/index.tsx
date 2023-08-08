import { BaseModal } from "@/components/Modals";
import { NewChatModalProps, useViewModel } from "./viewmodel";
import { BeatLoader } from "react-spinners";
import { User } from "@shared/models";
import { Avatar } from "@/components/UI/Avatar";
import { IconNotifier } from "@/components/UI/IconNotifier";

export function NewChatModal(props: NewChatModalProps) {
	const viewModel = useViewModel(props);

	function renderList() {
		if (viewModel.isLoading) {
			return (
				<div className="flex items-center justify-center w-[200px] h-[30px]">
					<BeatLoader color="black" />
				</div>
			);
		}

		if (viewModel.users.length == 0) {
			return (
				<IconNotifier
					icon="noto:face-exhaling"
					message="I think nobody has started to use this system."
				/>
			);
		}

		return (
			<ul className="w-[300px] lg:w-[400px] max-h-[200px] md:max-h-[300px] flex flex-col text-black gap-3 overflow-y-auto p-2">
				{viewModel.users?.map((user) => renderUser(user))}
			</ul>
		);
	}

	function renderUser(user: User) {
		return (
			<li
				key={user.name}
				className="p-3 bg-slate-300 items-center rounded-md justify-between flex w-full clickable border-2 border-slate-300 hover:bg-slate-400 hover:border-slate-500 "
			>
				<div className="flex gap-3 items-center">
					<Avatar user={user} />
					{user.name}
				</div>
				<div
					onClick={() => viewModel.handleItemClick(user.name)}
					className="p-3 bg-green-600 text-white rounded-lg shadow-lg"
				>
					Select
				</div>
			</li>
		);
	}

	return (
		<BaseModal {...viewModel.baseProps}>
			<div className="text-xl text-black font-bold mb-5">Chat with</div>
			{renderList()}
		</BaseModal>
	);
}
