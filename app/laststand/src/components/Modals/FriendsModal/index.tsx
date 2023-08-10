import { BaseModal } from "@/components/Modals";
import { FriendsModalProps, UserItem, useViewModel } from "./viewmodel";
import { BeatLoader } from "react-spinners";
import { Icon } from "@iconify/react";
import { Tab } from "@headlessui/react";
import { Fragment, ReactNode } from "react";
import { IconNotifier } from "@/components/UI/IconNotifier";
import { Avatar } from "@/components/UI/Avatar";

export function FriendsModal(props: FriendsModalProps) {
	const viewModel = useViewModel(props);

	function renderTab(label: string) {
		return (
			<Tab as={Fragment}>
				{({ selected }) => (
					<button
						className={`${
							selected ? "bg-slate-400 text-white" : ""
						} text-[10px] sm:text-[13px] md:text-[15px] shadow-none`}
					>
						{label}
					</button>
				)}
			</Tab>
		);
	}

	function renderRough(
		message: string = "Ohh buddy... That's rough.",
		icon: string = "ph:heart-straight-break-fill",
	) {
		return <IconNotifier message={message} icon={icon} />;
	}

	function renderActionIsLoading(friend: UserItem) {
		if (friend.isLoading) {
			return (
				<button className="bg-yellow-600">
					<BeatLoader color="white" />
				</button>
			);
		}
	}

	function renderFriend(friend: UserItem, actions?: ReactNode) {
		return (
			<li
				key={friend.name}
				className="flex justify-between rounded-lg bg-slate-200 p-3 items-center"
			>
				<div className="flex items-center gap-3">
					<Avatar user={friend} />
					<div className="text-sm sm:text-md">{friend.name}</div>
				</div>
				<div className="flex gap-3 items-center text-white">{actions}</div>
			</li>
		);
	}

	function renderList(list: UserItem[], actions?: (friend: UserItem) => ReactNode | undefined) {
		if (viewModel.isLoading) {
			return (
				<div className="flex items-center justify-center">
					<BeatLoader color="black" />
				</div>
			);
		}

		if (list.length > 0) {
			return (
				<ul className="flex flex-col text-black gap-3 overflow-y-auto w-full">
					{list.map((friend) =>
						renderFriend(friend, renderActionIsLoading(friend) || actions?.(friend)),
					)}
				</ul>
			);
		}
	}

	function renderFriendActions(friend: UserItem) {
		return (
			<>
				<button
					onClick={() => viewModel.handleFriendRemoveClick(friend.name)}
					className="bg-red-600 hover:bg-red-700 w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] p-2"
				>
					<Icon icon="material-symbols:delete" />
				</button>
				<button
					onClick={() => viewModel.handleFriendBlockClick(friend.name)}
					className="bg-red-700 hover:bg-red-800 w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] p-2"
				>
					<Icon icon="material-symbols:block" />
				</button>
			</>
		);
	}
	function renderFriends() {
		return (
			renderList(viewModel.friends, renderFriendActions) ||
			renderRough("Looks like you don't have any friends...", "carbon:person")
		);
	}

	function renderIncomingRequestAction(friend: UserItem) {
		return (
			<>
				<button
					onClick={() => viewModel.handleFriendApproveClick(friend.name)}
					className="bg-green-600 hover:bg-green-700 w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] p-2"
				>
					<Icon icon="material-symbols:check" fontSize="30px" />
				</button>
				<button
					onClick={() => viewModel.handleFriendDenyClick(friend.name)}
					className="bg-red-600 hover:bg-red-700 w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] p-2"
				>
					<Icon icon="gridicons:cross" fontSize="30px" />
				</button>
			</>
		);
	}
	function renderIncomingRequests() {
		return (
			renderList(viewModel.incomingRequests, renderIncomingRequestAction) ||
			renderRough("Nobody wants to meet you yet...", "mingcute:invite-line")
		);
	}

	function renderWaitingRequestAction(request: UserItem) {
		return (
			<button
				onClick={() => viewModel.handleFriendCancelRequestClick(request.name)}
				className="bg-slate-600 hover:bg-slate-700 text-sm sm:text-md"
			>
				Cancel
			</button>
		);
	}
	function renderWaitingRequests() {
		return (
			renderList(viewModel.waitingRequests, renderWaitingRequestAction) ||
			renderRough("You should be more sociable.", "carbon:friendship")
		);
	}

	function renderBlockedUserAction(user: UserItem) {
		return (
			<button
				onClick={() => viewModel.handleUnblockUserClick(user.name)}
				className="bg-rose-600 hover:bg-rose-700 text-sm sm:text-md"
			>
				Unblock
			</button>
		);
	}
	function renderBlockedUsers() {
		return (
			renderList(viewModel.blockedUsers, renderBlockedUserAction) ||
			renderRough("Looks like you get along good with everyone.", "icon-park-outline:heart") // Best regards to hocam: ftekdrmi
		);
	}

	function renderTabs() {
		return (
			<Tab.Group selectedIndex={viewModel.selectedTab} onChange={viewModel.handleTabChange}>
				<Tab.List className="flex bg-gray-200/60 rounded-lg space-x-1 p-1">
					{renderTab("Friends")}
					{renderTab("Incoming Requests")}
					{renderTab("Waiting Requests")}
					{renderTab("Blocked Users")}
				</Tab.List>
				<Tab.Panels className="w-full">
					<Tab.Panel>{renderFriends()}</Tab.Panel>
					<Tab.Panel>{renderIncomingRequests()}</Tab.Panel>
					<Tab.Panel>{renderWaitingRequests()}</Tab.Panel>
					<Tab.Panel>{renderBlockedUsers()}</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>
		);
	}

	return (
		<BaseModal {...viewModel.baseProps}>
			<div className="flex items-center justify-between w-[250px] sm:w-[400px] lg:w-[500px] max-h-[380px] flex-col gap-3 text-black">
				{renderTabs()}
				<button
					onClick={viewModel.handleFindFriendsClick}
					className="bg-slate-300 hover:bg-slate-400 gap-3 self-end"
				>
					<Icon icon="fluent-mdl2:add-friend" />
					Find friends
				</button>
			</div>
		</BaseModal>
	);
}
