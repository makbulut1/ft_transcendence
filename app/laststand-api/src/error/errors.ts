import {
	ERR_ADMIN_CANNOT_BANNED,
	ERR_ALREADY_INVITED,
	ERR_ALREADY_MEMBER,
	ERR_ALREADY_REQUESTED,
	ERR_ALREADY_WAITING,
	ERR_AN_ERROR_OCCURRED,
	ERR_AUTH_ERROR,
	ERR_CANNOT_KICK,
	ERR_CHANNEL_ALREADY_EXISTS,
	ERR_CHANNEL_DOESNT_EXISTS,
	ERR_EMPTY_MESSAGE,
	ERR_GAME_DOESNT_EXISTS,
	ERR_HAVENT_FRIEND_REQUEST,
	ERR_IT_IS_OWNER,
	ERR_MEMBER_IS_BANNED,
	ERR_MEMBER_MUTED,
	ERR_NAME_MUST_BE_UNIQUE,
	ERR_NEED_PRIVILEGES,
	ERR_NOT_A_MEMBER,
	ERR_NOT_A_PRIVATE_CHANNEL,
	ERR_NOT_INVITED,
	ERR_NOT_LOGGED,
	ERR_USER_DOESNT_EXISTS,
	ERR_USER_NOT_BLOCKED,
	ERR_WRONG_2FA_CODE,
	ERR_WRONG_INPUT,
	ERR_WRONG_PASSWORD,
} from "@shared/errorCodes";
import { LSError } from "@shared/types/error.interface";

// Auth errors
export function AUTH_ERROR(): LSError {
	return {
		code: ERR_AUTH_ERROR,
		message: `Authentication error`,
	};
}
export function WRONG_2FA_CODE(): LSError {
	return {
		code: ERR_WRONG_2FA_CODE,
		message: "Invalid code",
	};
}
export function NOT_LOGGED(): LSError {
	return {
		code: ERR_NOT_LOGGED,
		message: "You have to log in",
	};
}

// General errors
export function AN_ERROR_OCCURRED(): LSError {
	return {
		code: ERR_AN_ERROR_OCCURRED,
		message: `An error occurred.`,
	};
}
export function WRONG_INPUT(): LSError {
	return {
		code: ERR_WRONG_INPUT,
		message: `Wrong input`,
	};
}
export function WRONG_PASSWORD(): LSError {
	return {
		code: ERR_WRONG_PASSWORD,
		message: `Wrong password`,
	};
}
export function NEED_PRIVILEGES(username: string): LSError {
	return {
		code: ERR_NEED_PRIVILEGES,
		message: `@${username} doesn't have enough privileges to perform this operation.`,
	};
}

// Game errors
export function ALREADY_WAITING(username: string): LSError {
	return {
		code: ERR_ALREADY_WAITING,
		message: `@${username} already in the wait list.`,
	};
}
export function GAME_DOESNT_EXISTS(): LSError {
	return {
		code: ERR_GAME_DOESNT_EXISTS,
		message: `Game does not exists`,
	};
}

// User errors
export function USER_NOT_BLOCKED(username: string, by: string): LSError {
	return {
		code: ERR_USER_NOT_BLOCKED,
		message: `@${username} is not blocked by @${by}`,
	};
}
export function USER_DOESNT_EXISTS(username?: string): LSError {
	return {
		code: ERR_USER_DOESNT_EXISTS,
		message: username ? `@${username} doesn't exists.` : "User not found",
	};
}
export function NAME_MUST_BE_UNIQUE(): LSError {
	return {
		code: ERR_NAME_MUST_BE_UNIQUE,
		message: `Name must be unique`,
	};
}

// Channel errors
export function NOT_A_MEMBER(username: string, channelName: string): LSError {
	return {
		code: ERR_NOT_A_MEMBER,
		message: `@${username} is not a member of #${channelName}`,
	};
}
export function ALREADY_INVITED(username: string, channelName: string): LSError {
	return {
		code: ERR_ALREADY_INVITED,
		message: `@${username} already invited to channel #${channelName}.`,
	};
}

export function ALREADY_MEMBER(username: string, channelName: string): LSError {
	return {
		code: ERR_ALREADY_MEMBER,
		message: `@${username} is already a member of #${channelName}.`,
	};
}

export function CHANNEL_DOESNT_EXISTS(channelName: string): LSError {
	return {
		code: ERR_CHANNEL_DOESNT_EXISTS,
		message: `#${channelName} doesn't exists.`,
	};
}

export function CHANNEL_ALREADY_EXISTS(channelName: string): LSError {
	return {
		code: ERR_CHANNEL_ALREADY_EXISTS,
		message: `#${channelName} is already exists.`,
	};
}
export function MEMBER_IS_BANNED(username: string, channelName: string): LSError {
	return {
		code: ERR_MEMBER_IS_BANNED,
		message: `@${username} is banned from #${channelName}.`,
	};
}
export function NOT_A_PRIVATE_CHANNEL(channelName: string): LSError {
	return {
		code: ERR_NOT_A_PRIVATE_CHANNEL,
		message: `#${channelName} is not a private channel.`,
	};
}
export function MEMBER_MUTED(username: string, channelName: string): LSError {
	return {
		code: ERR_MEMBER_MUTED,
		message: `@${username} muted on #${channelName}`,
	};
}
export function NOT_INVITED(username: string, channelName: string): LSError {
	return {
		code: ERR_NOT_INVITED,
		message: `@${username} hasn't invited to #${channelName}`,
	};
}
export function ADMIN_CANNOT_BANNED(): LSError {
	return {
		code: ERR_ADMIN_CANNOT_BANNED,
		message: `Admin cannot banned.`,
	};
}
export function IT_IS_OWNER(username: string, channelName: string): LSError {
	return {
		code: ERR_IT_IS_OWNER,
		message: `@${username} owner of the #${channelName}.`,
	};
}

export function CANNOT_KICK(username: string): LSError {
	return {
		code: ERR_CANNOT_KICK,
		message: `@${username} cannot kick`,
	};
}

// Chat errors
export function EMPTY_MESSAGE(): LSError {
	return {
		code: ERR_EMPTY_MESSAGE,
		message: "Cannot send empty messages",
	};
}

// Friend errors
export function HAVENT_FRIEND_REQUEST(username: string, friendName: string): LSError {
	return {
		code: ERR_HAVENT_FRIEND_REQUEST,
		message: `@${username} didn't send a friend request to @${friendName}`,
	};
}
export function ALREADY_REQUESTED(username: string, friendName: string) {
	return {
		message: `@${username} has already requested to @${friendName}`,
		code: ERR_ALREADY_REQUESTED,
	};
}
