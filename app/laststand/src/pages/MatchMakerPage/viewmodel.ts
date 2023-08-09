import { useMatchMakerSocket, useSocialSocket } from "@/hooks/useSocket";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { ERR_ALREADY_WAITING } from "@shared/errorCodes";
import { User } from "@shared/models";
import {
	CANCEL_MATCH_SEARCH,
	FIND_MATCH,
	MATCHMAKER_LOGGED,
	MATCH_FOUND,
	MATCH_SEARCH_CANCELED,
	WENT_WRONG,
} from "@shared/socketEvents";
import { LSError } from "@shared/types";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type State = "loading" | "waiting" | "error" | "find" | "match_found";
type Map = "default" | "neverland";

export function useViewModel() {
	const [rival, setRival] = useState<User>();
	const [state, setState] = useState<State>("loading");
	const [countdown, setCountdown] = useState<number>(2);
	const [map, setMap] = useState<Map>("default");
	const token = useRef<string | null>(null);
	const navigate = useNavigate();
	const mm = useMatchMakerSocket();
	const finderInterval = useRef<number | null>(null);

	// Just notify online
	useSocialSocket();

	// UI events
	function handleFindMatchClick() {
		setState("waiting");
		mm.emit(FIND_MATCH);
		finderInterval.current = setInterval(() => {
			mm.emit(FIND_MATCH);
		}, 3000);
	}
	function handleCancelClick() {
		mm.emit(CANCEL_MATCH_SEARCH);
	}
	function handleMapChange(value: Map) {
		setMap(value);
		localStorage.setItem("map", value);
	}

	// Socket events
	function wentWrong(data: { error: LSError }) {
		setState("find");
		console.error("MatchMaker.socket error:", data.error);
		if (finderInterval.current) {
			clearInterval(finderInterval.current);
		}
		if (data.error.code == ERR_ALREADY_WAITING) {
			toast.error("You already have a open tab.");
			navigate("/chat", { replace: true });
		} else {
			toast.error(data.error.message);
		}
	}
	function logged() {
		setState("find");
	}
	function matchSearchCanceled() {
		setState("find");
		if (finderInterval.current) {
			clearInterval(finderInterval.current);
		}
	}
	function matchFound(data: { token: string; rival: User }) {
		setRival(data.rival);
		setState("match_found");

		if (finderInterval.current) {
			clearInterval(finderInterval.current);
		}

		const interval = setInterval(() => {
			setCountdown((old) => {
				if (old == 1) {
					clearInterval(interval);
					token.current = data.token;
					return 0;
				} else {
					return old - 1;
				}
			});
		}, 1000);
	}

	useSocketEvent(mm, WENT_WRONG, wentWrong, [finderInterval.current]);
	useSocketEvent(mm, MATCH_FOUND, matchFound, [finderInterval.current]);
	useSocketEvent(mm, MATCH_SEARCH_CANCELED, matchSearchCanceled, [finderInterval.current]);
	useSocketEvent(mm, MATCHMAKER_LOGGED, logged);

	useEffect(() => {
		if (countdown == 0 && token.current) {
			navigate(`/game?token=${encodeURIComponent(token.current!)}`, { replace: true });
		}
	}, [countdown]);

	useEffect(() => {
		localStorage.setItem("map", "default");
	}, []);

	return {
		countdown,
		state,
		rival,
		map,
		handleFindMatchClick,
		handleCancelClick,
		handleMapChange,
	};
}
