import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Channel, ChannelMember, Conversation, Message, User } from "@shared/models";
import { getChat } from "@/api/raw/getChat";
import { useModalStore } from "@/stores/useModalStore";
import { NewChatModal, FriendsModal } from "@/components/Modals";
import {
	DELETED_CHANNEL,
	LEAVED_CHANNEL,
	JOINED_CHANNEL,
	WENT_WRONG,
	RECEIVED_MESSAGE,
	SEND_MESSAGE,
	BANNED_CHANNEL,
	UNBLOCKED_CHANNEL,
	BLOCKED_USER,
	BLOCKED_BY,
	USER_EDITED,
	INVITED_TO_MATCH,
	ACCEPT_MATCH,
	MATCH_FOUND,
} from "@shared/socketEvents";
import { LSError } from "@shared/types";
import { sortConversationList } from "@shared/utils/sort";
import { ChannelsModal } from "@/components/Modals/ChannelsModal";
import { getConversationList } from "@/api/raw/getConversationList";
import { ChannelInfoModal } from "@/components/Modals/ChannelInfoModal";
import { getConversationLabel } from "@/utils/string/getConversationLabel";
import { shortString } from "@/utils/string/shortString";
import { toast } from "react-toastify";
import { useAuthStore } from "@/stores/useAuthStore";
import { ProfileModal } from "@/components/Modals/ProfileModal";
import { useMatchMakerSocket, useSocialSocket } from "@/hooks/useSocket";
import { useNavigate } from "react-router-dom";
import { useSocketEvent } from "@/hooks/useSocketEvent";

export function useViewModel() {
	const [messageInput, setMessageInput] = useState<string>("");
	const [isConversationLoading, setIsConversationLoading] = useState<boolean>(false);
	const [isConversationListLoading, setIsConversationListLoading] = useState<boolean>(false);
	const [conversationList, setConversationList] = useState<Conversation[]>([]);
	const [currentConversation, setCurrentConversation] = useState<Conversation>();

	const navigate = useNavigate();
	const social = useSocialSocket();
	const mm = useMatchMakerSocket();
	const modal = useModalStore();
	const auth = useAuthStore();

	const messageFieldRef = useRef<HTMLUListElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Functions
	async function loadConversation(conversation: Conversation) {
		setIsConversationLoading(true);
		try {
			setCurrentConversation(await getChat(conversation));
		} catch (err) {}
		setIsConversationLoading(false);
	}
	async function loadConversationList() {
		setIsConversationListLoading(true);
		try {
			setConversationList(await getConversationList());
		} catch (err) {}
		setIsConversationListLoading(false);
	}
	async function pushNotify(title: string, body?: string, img?: string) {
		const request = await Notification.requestPermission();

		if (request == "granted") {
			new Notification(title, {
				icon: img,
				body,
				tag: title,
			});
		}
	}
	function closeConversation() {
		setCurrentConversation(undefined);
	}
	function updateConversationListItem(targetConversation: Conversation, newMessage?: Message) {
		setConversationList((old) => {
			const newList = [...old];
			const messages = newMessage ? [newMessage] : [];
			const index = newList.findIndex((x) => x.name == targetConversation.name);

			// If conversation is not in the list yet, add it.
			if (index == -1) {
				newList.push({
					...targetConversation,
					messages,
				});
			} else {
				newList[index].messages = messages;
			}

			sortConversationList(newList);

			return newList;
		});
	}
	function addMessage(message: Message) {
		if (currentConversation) {
			const oldMessages = currentConversation.messages ?? [];
			setCurrentConversation({
				...currentConversation,
				messages: [...oldMessages, message],
			});
			updateConversationListItem(currentConversation, message);
		}
	}
	function removeConversation(conversationName: string) {
		if (currentConversation?.name == conversationName) {
			setCurrentConversation(undefined);
			setMessageInput("");
		}

		// Remove it from conversation list
		setConversationList((old) =>
			old.filter((conversation) => conversation.name != conversationName),
		);
	}
	function sendMessage() {
		if (messageInput == "") {
			return;
		}
		social.emit(SEND_MESSAGE, {
			message: {
				ownerName: auth?.username!,
				content: messageInput,
			},
			conversation: {
				name: currentConversation!.name,
				type: currentConversation!.type,
			},
		});
		setMessageInput("");
	}

	// UI events
	function handleNewChatButtonClick() {
		modal.openModal(<NewChatModal onSelected={loadConversation} />);
	}
	function handleChannelsButtonClick() {
		modal.openModal(<ChannelsModal />);
	}
	function handleFriendsButtonClick() {
		modal.openModal(<FriendsModal />);
	}
	function handleCloseConversationClick() {
		closeConversation();
	}
	function handleMessageInputChange(event: ChangeEvent<HTMLInputElement>) {
		setMessageInput(event.target.value);
	}
	function handleInputOnKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key == "Enter") {
			sendMessage();
		}
	}
	function handleConversationClick(conversation: Conversation) {
		setCurrentConversation(conversation);
		loadConversation(conversation);
		setMessageInput("");
	}
	function handleConversationHeaderClick() {
		if (currentConversation) {
			if (currentConversation.type == "channel") {
				modal.openModal(<ChannelInfoModal channelName={currentConversation!.name} />);
			} else {
				modal.openModal(<ProfileModal username={currentConversation.name} />);
			}
		}
	}

	// Socket events
	async function joinedChannel(data: { member: ChannelMember; channel: Channel }) {
		if (auth?.username == data.member.user.name) {
			const conversation = await getChat(
				{
					name: data.channel.name,
					type: "channel",
				},
				false,
			);

			setConversationList((old) => {
				const newList = [...old, conversation];
				sortConversationList(newList);
				return newList;
			});
		}
	}
	function blockedUser(data: { user: User }) {
		removeConversation(data.user.name);
	}
	function blockedBy(data: { user: User }) {
		removeConversation(data.user.name);
	}
	function deletedChannel(data: { by: ChannelMember; channel: Channel }) {
		removeConversation(data.channel.name);
	}
	function leavedChannel(data: { member: ChannelMember; channel: Channel }) {
		if (data.member.user.name == auth?.username) {
			removeConversation(data.channel.name);
		}
	}
	function wentWrong(data: { error: LSError }) {
		toast.error(data.error.message);
		console.error("Chat.Socket error:", data.error);
	}
	function receivedMessage(data: { message: Message; conversation: Conversation }) {
		if (data.message.sentDate) {
			data.message.sentDate = new Date(data.message.sentDate);
		}

		if (data.conversation.name == currentConversation?.name) {
			// addMessage() already updates conversation list.
			addMessage(data.message);
		} else {
			updateConversationListItem(data.conversation, data.message);
		}

		if (data.message.ownerName != auth?.username) {
			pushNotify(
				getConversationLabel(data.conversation),
				shortString(
					(data.conversation.type == "channel" ? `@${data.message.ownerName}: ` : "") +
						data.message.content,
					30,
				),
			);
		}
	}
	function bannedChannel(data: { member: ChannelMember; channel: Channel }) {
		if (data.member.user.name == auth?.username) {
			removeConversation(data.channel.name);
		}
	}
	function userEdited(data: { oldUser: User; newUser: User }) {
		const index = conversationList.findIndex(
			(x) => x.name == data.oldUser.name && x.type == "private",
		);

		if (index != -1) {
			setConversationList((old) => {
				const newList = [...old];
				newList[index].name = data.newUser.name;
				newList[index].image = data.newUser.avatar;
				return newList;
			});
		}

		if (currentConversation?.type == "private") {
			if (currentConversation?.name == data.oldUser.name) {
				setCurrentConversation((old) => ({
					...old!,
					messages: old?.messages?.map((x) => ({
						...x,
						ownerName:
							x.ownerName == data.oldUser.name ? data.newUser.name : x.ownerName,
					})),
					name: data.newUser.name,
					image: data.newUser.avatar,
				}));
			}
		} else if (currentConversation?.type == "channel") {
			setCurrentConversation((old) => ({
				...old!,
				messages: old?.messages?.map((x) => ({
					...x,
					ownerName: x.ownerName == data.oldUser.name ? data.newUser.name : x.ownerName,
				})),
			}));
		}
	}
	function matchFound(data: { token: string; rival: User }) {
		modal.closeModal();
		navigate(`/game?token=${encodeURIComponent(data.token)}`, { replace: true });
	}
	function invitedToMatch(data: { user: User }) {
		toast.info(
			<div className="w-full flex flex-col gap-3 text-white">
				<div className="text-black">{data.user.name} challenges you!</div>
				<div className="flex gap-3 w-full justify-end">
					<button
						onClick={() => {
							mm.emit(ACCEPT_MATCH, { username: data.user.name });
						}}
						className="bg-green-600 hover:bg-green-700"
					>
						Accept
					</button>
					<button className="bg-red-600 hover:bg-red-700">Deny</button>
				</div>
			</div>,
			{ autoClose: 20 * 1000 },
		);
	}
	async function unblockedChannel(data: { member: ChannelMember; channel: Channel }) {
		if (data.member.user.name == auth?.username) {
			const conversation = await getChat({ name: data.channel.name, type: "channel" }, false);

			setConversationList((old) => {
				const newList = [...old, conversation];
				sortConversationList(newList);
				return newList;
			});
		}
	}

	useSocketEvent(social, USER_EDITED, userEdited, [auth, conversationList, currentConversation]);
	useSocketEvent(social, RECEIVED_MESSAGE, receivedMessage, [currentConversation, auth]);
	useSocketEvent(social, DELETED_CHANNEL, deletedChannel, [currentConversation]);
	useSocketEvent(social, BLOCKED_USER, blockedUser, [currentConversation]);
	useSocketEvent(social, BLOCKED_BY, blockedBy, [currentConversation]);
	useSocketEvent(social, LEAVED_CHANNEL, leavedChannel, [currentConversation, auth]);
	useSocketEvent(social, JOINED_CHANNEL, joinedChannel, [currentConversation, auth]);
	useSocketEvent(social, BANNED_CHANNEL, bannedChannel, [auth, currentConversation]);
	useSocketEvent(social, UNBLOCKED_CHANNEL, unblockedChannel, [auth, currentConversation]);
	useSocketEvent(social, INVITED_TO_MATCH, invitedToMatch);
	useSocketEvent(social, WENT_WRONG, wentWrong);
	useSocketEvent(mm, MATCH_FOUND, matchFound);

	useEffect(() => {
		messageFieldRef.current?.scroll({
			top: messageFieldRef.current?.scrollHeight,
			behavior: "smooth",
		});
		inputRef.current?.focus();
	}, [currentConversation]);

	useEffect(() => {
		loadConversationList();
		function onKeyDown(event: globalThis.KeyboardEvent) {
			if (event.key == "Escape") {
				closeConversation();
			}
		}

		if (localStorage.getItem("firstLogin") === "true") {
			modal.openModal(<ProfileModal />);
		}
		document.body.addEventListener("keydown", onKeyDown);
		return () => document.body.removeEventListener("keydown", onKeyDown);
	}, []);

	return {
		auth,
		isConversationListLoading,
		conversationList,
		currentConversation,
		isConversationLoading,
		messageInput,
		messageFieldRef,
		inputRef,
		username: auth?.username!,
		handleConversationHeaderClick,
		handleConversationClick,
		handleMessageInputChange,
		handleInputOnKeyDown,
		handleChannelsButtonClick,
		handleFriendsButtonClick,
		handleNewChatButtonClick,
		handleCloseConversationClick,
	};
}
