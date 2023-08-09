import { Icon } from "@iconify/react";
import { BeatLoader } from "react-spinners";
import { useViewModel } from "./viewmodel";
import { ConversationListItem } from "./components/ConversationListItem";
import { getConversationLabel } from "@/utils/string/getConversationLabel";
import { ConversationMessage } from "@/pages/ChatPage/components/ConversationMessage";
import { IconNotifier } from "@/components/UI/IconNotifier";
import { Transition } from "@headlessui/react";
import { Dashboard } from "@/layouts/Dashboard";

export function ChatPage() {
	const viewModel = useViewModel();

	function renderConversationList() {
		if (viewModel.isConversationListLoading) {
			return <BeatLoader className="absolute top-[40%] left-[40%]" color="white" />;
		}

		if (viewModel.conversationList.length == 0) {
			return (
				<IconNotifier
					color="white"
					message="What a quiet place..."
					icon="arcticons:quit-tracker"
				/>
			);
		}

		return viewModel.conversationList?.map((conversation) => (
			<ConversationListItem
				key={`${conversation.type == "private" ? "@" : "#"}${conversation.name}`}
				conversation={conversation}
				isSelected={viewModel.currentConversation?.name == conversation.name}
				onClick={viewModel.handleConversationClick}
			/>
		));
	}

	function renderMessages() {
		return (
			<ul
				ref={viewModel.messageFieldRef}
				className="flex flex-col overflow-y-auto h-[calc(100vh-250px)] md:h-[calc(100vh-260px)]"
			>
				{viewModel.currentConversation?.messages?.map((message, index) => (
					<ConversationMessage
						key={index}
						message={message}
						conversation={viewModel.currentConversation!}
					/>
				))}
			</ul>
		);
	}

	function renderCurrentConversation() {
		function renderInside() {
			if (viewModel.isConversationLoading) {
				return (
					<div className="flex items-center justify-center flex-1 h-full w-full">
						<BeatLoader color="white" />
					</div>
				);
			}
			return (
				<>
					{renderMessages()}
					<div className="flex justify-between pr-3 md:pr-0">
						<input
							placeholder="Let's talk about bridges, golf and politics..."
							ref={viewModel.inputRef}
							value={viewModel.messageInput}
							onChange={viewModel.handleMessageInputChange}
							onKeyDown={viewModel.handleInputOnKeyDown}
							className="p-3 md:p-4 md:m-4 shadow-lg bg-slate-300 rounded-lg text-black outline-none transition-all duration-500 focus:outline-blue-500 w-[calc(100%-70px)] md:w-full m-1"
						/>
						<button className="w-[50px] h-[50px] flex items-center justify-center md:hidden rounded-full bg-gray-500">
							<Icon icon="material-symbols:send" />
						</button>
					</div>
				</>
			);
		}
		return (
			<Transition
				appear
				show={!!viewModel.currentConversation}
				className="bg-gray-700 border-b-2 border-b-white md:border-none md:rounded-lg overflow-hidden flex flex-col md:h-fit md:m-5 flex-1"
				enter="ease-out duration-300"
				enterFrom="opacity-0 scale-95"
				enterTo="opacity-100 scale-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-95"
			>
				<div className="bg-slate-800 text-white text-xl font-bold flex justify-between items-center p-2">
					<button
						onClick={viewModel.handleCloseConversationClick}
						className="p-2 rounded-full hover:bg-slate-400"
					>
						<Icon fontSize="25px" icon="maki:cross" />
					</button>

					{viewModel.currentConversation && (
						<div
							className="hover:cursor-pointer hover:underline"
							onClick={viewModel.handleConversationHeaderClick}
						>
							{getConversationLabel(viewModel.currentConversation)}
						</div>
					)}
					<div />
				</div>
				{renderInside()}
			</Transition>
		);
	}

	function renderAction(onClick: () => void, icon: string) {
		return (
			<button
				className="w-[60px] h-[60px] flex items-center justify-center rounded-full p-3 transition-all duration-300 hover:bg-slate-400"
				onClick={onClick}
			>
				<Icon fontSize="30px" icon={icon} />
			</button>
		);
	}

	function renderActions() {
		return (
			<div className="bg-slate-700 h-fit flex items-center md:gap-3 justify-between md:justify-center md:border-b-[1px] md:border-b-gray-500 w-full">
				{renderAction(viewModel.handleNewChatButtonClick, "material-symbols:chat")}
				{renderAction(viewModel.handleFriendsButtonClick, "fa-solid:user-friends")}
				{renderAction(viewModel.handleChannelsButtonClick, "fluent:channel-16-filled")}
			</div>
		);
	}

	return (
		<Dashboard>
			<div className="bg-black text-white flex-col md:flex-row flex h-full">
				<div className="hidden md:flex flex-col md:w-[330px] border-r-2 border-r-gray-200">
					{renderActions()}
					<ul className="h-full overflow-y-auto bg-gray-600 flex flex-col p-2 gap-3 pt-3">
						{renderConversationList()}
					</ul>
				</div>
				{!!viewModel.currentConversation ? (
					renderCurrentConversation()
				) : (
					<ul className="flex-1 max-h-[calc(100vh-130px)] w-full md:hidden overflow-y-auto bg-gray-600 flex flex-col p-2 gap-3 pt-3">
						{renderConversationList()}
					</ul>
				)}
				<div className="block md:hidden h-fit">{renderActions()}</div>
			</div>
		</Dashboard>
	);
}
