import moment from "moment";
import { Avatar } from "@/components/UI/Avatar";
import { getConversationLabel } from "@/utils/string/getConversationLabel";
import { Conversation } from "@shared/models";
import { shortString } from "@/utils/string/shortString";

export interface ConversationListItemProps {
	onClick: (conversation: Conversation) => void;
	conversation: Conversation;
	isSelected?: boolean;
}

export function ConversationListItem(props: ConversationListItemProps) {
	function renderSentTime() {
		const message = props.conversation.messages?.[0];
		if (message) {
			return moment(message.sentDate).format("HH:mm");
		}
	}

	function renderMessagePreview(conversation: Conversation) {
		const message = conversation.messages?.[0];

		if (message) {
			if (conversation.type == "channel") {
				return shortString(`@${message.ownerName}: ${message.content}`, 20);
			} else {
				return shortString(message.content, 20);
			}
		}
	}

	function renderAvatar() {
		if (props.conversation.type == "private") {
			return (
				<Avatar
					user={{
						name: props.conversation.name,
						avatar: props.conversation.image!,
					}}
				/>
			);
		}

		return (
			<div className="relative">
				<div className="flex items-center overflow-hidden rounded-full w-[50px] h-[50px]">
					<div className="flex items-center justify-center text-xl text-black font-bold w-full h-full bg-blue-200 rounded-full border-2 border-black">
						#
					</div>
				</div>
			</div>
		);
	}

	if (props.conversation.type == "private" && props.conversation.messages?.length == 0) {
		return <></>;
	}

	return (
		<li
			className={`flex flex-col rounded-lg hover:border-slate-800 transition-all duration-200 hover:translate-y-[-5px] bg-slate-600 border-2 border-slate-700 shadow-md ${
				props.isSelected && "border-slate-800"
			}`}
			onClick={() => props.onClick(props.conversation)}
		>
			<div
				className={`${
					props.isSelected && "bg-gray-700"
				} flex gap-3 rounded-lg p-3 transition-all duration-200 hover:cursor-pointer hover:bg-gray-700`}
			>
				{renderAvatar()}

				<div className="flex flex-col flex-1">
					<div>{getConversationLabel(props.conversation)}</div>
					<div className="text-gray-400">{renderMessagePreview(props.conversation)}</div>
					<div className="text-gray-400 self-end">{renderSentTime()}</div>
				</div>
			</div>
		</li>
	);
}
