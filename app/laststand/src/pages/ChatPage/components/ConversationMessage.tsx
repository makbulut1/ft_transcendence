import moment from "moment";
import { Conversation, Message } from "@shared/models";
import { useAuthStore } from "@/stores/useAuthStore";
import { useModalStore } from "@/stores/useModalStore";
import { ProfileModal } from "@/components/Modals/ProfileModal";

export interface ConversationMessageProps {
	conversation: Conversation;
	message: Message;
}

export function ConversationMessage(props: ConversationMessageProps) {
	const auth = useAuthStore();
	const modal = useModalStore();

	function handleNameClick() {
		modal.openModal(<ProfileModal username={props.message.ownerName} />);
	}

	return (
		<li
			className={`select-text flex flex-col p-2 m-3 w-fit max-w-[100%] bg-slate-300 text-black break-words ${
				props.message.ownerName == auth?.username
					? "self-end rounded-t-xl rounded-bl-xl"
					: "rounded-t-xl rounded-br-xl"
			}`}
		>
			{props.conversation.type == "channel" ? (
				<div className="text-sm">
					@
					<span
						onClick={handleNameClick}
						className="italic font-bold hover:underline hover:cursor-pointer"
					>
						{props.message.ownerName}
					</span>
				</div>
			) : null}

			{props.message.content}
			<div className="text-slate-500 self-end flex justify-between gap-3 w-full">
				<div>{moment(props.message.sentDate).format("DD.MM.YYYY")}</div>
				<div>{moment(props.message.sentDate).format("HH:mm")}</div>
			</div>
		</li>
	);
}
