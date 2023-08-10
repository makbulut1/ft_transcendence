import { Conversation } from "../../models";

/**
 * https://stackoverflow.com/questions/67930989/prisma-order-by-relation-has-only-count-property-can-not-order-by-relation-fie
 */
export function sortConversationList(list: Conversation[]) {
	list.sort((a, b) => {
		if (!a?.messages?.[0]?.sentDate) return 1;
		if (!b?.messages?.[0]?.sentDate) return -1;
		if (
			a.messages[0].sentDate.getTime() > b.messages[0].sentDate.getTime()
		) {
			return -1;
		} else if (
			a.messages[0].sentDate.getTime() < b.messages[0].sentDate.getTime()
		) {
			return 1;
		} else {
			return 0;
		}
	});
}
