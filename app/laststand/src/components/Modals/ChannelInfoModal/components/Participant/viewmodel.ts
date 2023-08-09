import { ChannelMember } from "@shared/models";
import { useEffect, useRef, useState } from "react";
import moment from "moment";

export interface ParticipantProps {
	member: ChannelMember;
}

export function useViewModel(props: ParticipantProps) {
	const interval = useRef(-1);
	const [leftMinute, setLeftMinute] = useState<number>(0);

	function updateMute() {
		const end = moment(props.member.muteEnd);
		const minuteDiff = Math.floor(moment.duration(end.diff(moment())).asMinutes());

		if (minuteDiff < 0) {
			setLeftMinute(-1);
		} else {
			setLeftMinute(minuteDiff);
		}
	}
	function clearMuteInterval() {
		clearInterval(interval.current);
		setLeftMinute(-1);
	}
	function checkMute(): boolean {
		const now = moment();
		const end = moment(props.member.muteEnd);
		if (props.member.muteStart) {
			return now.isBefore(end);
		}
		return false;
	}
	function setMuteInterval(): boolean {
		if (checkMute()) {
			updateMute();
			clearInterval(interval.current);
			interval.current = setInterval(() => {
				updateMute();
			}, 1000);
			return true;
		}
		return false;
	}

	useEffect(() => {
		setMuteInterval();
		return () => clearInterval(interval.current);
	}, []);

	useEffect(() => {
		if (checkMute()) {
			setMuteInterval();
		} else {
			clearMuteInterval();
		}
	}, [props.member]);

	return {
		leftMinute,
	};
}
