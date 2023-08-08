// Actions
export const SEND_MESSAGE = "send_message";
export const LOGIN = "login";

export const FRIEND_APPROVE = "friend_approve";
export const FRIEND_REQUEST = "friend_request";
export const FRIEND_CANCEL_REQUEST = "friend_cancel_request";
export const FRIEND_DENY = "friend_deny";
export const FRIEND_REMOVE = "friend_remove";

export const BLOCK_USER = "block_user";
export const UNBLOCK_USER = "unblock_user";
export const EDIT_USER = "edit_user";

export const CHANNEL_CREATE = "channel_create";
export const CHANNEL_LEAVE = "channel_leave";
export const CHANNEL_DELETE = "channel_delete";
export const CHANNEL_APPROVE = "channel_approve";
export const CHANNEL_DENY = "channel_deny";
export const CHANNEL_INVITE = "channel_invite";
export const CHANNEL_JOIN = "channel_join";
export const CHANNEL_KICK = "channel_kick";
export const CHANNEL_MAKE_ADMIN = "channel_make_admin";
export const CHANNEL_TAKE_ADMIN = "channel_take_admin";
export const CHANNEL_BAN = "channel_ban";
export const CHANNEL_UNBLOCK = "channel_unblock";
export const CHANNEL_MUTE = "channel_mute";
export const CHANNEL_UNMUTE = "channel_unmute";
export const CHANNEL_EDIT = "channel_edit";

export const FIND_MATCH = "find_match";
export const CANCEL_MATCH_SEARCH = "cancel_match_search";
export const JOIN_MATCH = "join_match";
export const PLAYER_MOVE = "player_move";
export const INVITE_MATCH = "invite_match";
export const ACCEPT_MATCH = "accept_match";

// Events
export const RECEIVED_MESSAGE = "received_message";
export const MESSAGE_SENT = "message_sent";

export const WENT_WRONG = "went_wrong";
export const INCOMING_FRIEND_REQUEST = "incoming_friend_request";
export const OUTGOING_FRIEND_REQUEST = "outgoing_friend_request";
export const CANCELED_FRIEND_REQUEST = "canceled_friend_request";
export const REMOVED_FRIEND = "remove_friend";
export const NOW_FRIEND = "now_friend";
export const DENIED_FRIEND = "denied_friend";
export const DENIED_BY = "denied_by";

export const USER_EDITED = "user_edited";

export const UNBLOCKED_USER = "unblocked_user";
export const UNBLOCKED_BY = "unblocked_by";
export const BLOCKED_BY = "blocked_by";
export const BLOCKED_USER = "blocked_user";

export const FRIEND_OFFLINE = "friend_offline";
export const FRIEND_ONLINE = "friend_online";
export const FRIEND_IN_GAME = "friend_in_game";

export const JOINED_CHANNEL = "joined_channel";
export const LEAVED_CHANNEL = "leaved_channel";
export const DELETED_CHANNEL = "deleted_channel";
export const DENIED_CHANNEL = "denied_channel";
export const INVITED_TO_CHANNEL = "invited_to_channel";
export const SENT_INVITE_CHANNEL = "sent_invite_channel";
export const NEW_CHANNEL_APPEARED = "new_channel_appeared";
export const CREATED_CHANNEL = "created_channel";
export const MADE_ADMIN_CHANNEL = "made_admin_channel";
export const TAKEN_ADMIN_CHANNEL = "taken_admin_channel";
export const BANNED_CHANNEL = "banned_channel";
export const UNBLOCKED_CHANNEL = "unblocked_channel";
export const MUTED_CHANNEL = "muted_channel";
export const UNMUTED_CHANNEL = "unmuted_channel";
export const EDITED_CHANNEL = "edited_Channel";

export const ACHIEVEMENT_EARNED = "achievement_earned";

export const MATCH_FOUND = "match_found";
export const MATCH_INIT = "match_init";
export const MATCH_CANCEL = "match_cancel";
export const MATCH_OVER = "match_over";
export const BALL_UPDATE = "ball_update";
export const PLAYER_MOVED = "player_moved";
export const PLAYER_SCORED = "player_scored";
export const PLAYER_DROP = "player_drop";
export const PLAYER_RECONNECT = "player_reconnect";
export const INVITED_TO_MATCH = "invited_to_match";
export const MATCH_SEARCH_CANCELED = "match_search_canceled";

export const MATCHMAKER_LOGGED = "logged";
export const SOCIAL_LOGGED = "social_logged";
