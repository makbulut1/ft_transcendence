import { ActionMenuProps, useViewModel } from "./viewmodel";
import { MoonLoader } from "react-spinners";
import { useCallback } from "react";
import { Menu, MenuItem } from "@/components/UI/Menu";
import moment from "moment";

export function ActionMenu(props: ActionMenuProps) {
	const viewModel = useViewModel(props);

	const renderActions = useCallback(() => {
		const kick = (
			<MenuItem
				key="kick"
				onClick={viewModel.handleKickClick}
				icon="mdi:kickboxing"
				label="Kick"
			/>
		);
		const ban = (
			<MenuItem onClick={viewModel.handleBan} key="ban" icon="ion:ban-sharp" label="Ban" />
		);
		const unban = (
			<MenuItem
				onClick={viewModel.handleUnblock}
				key="unban"
				icon="raphael:unlock"
				label="Unblock"
			/>
		);
		const mute = (
			<MenuItem onClick={viewModel.handleMute} key="mute" icon="wpf:mute" label="Mute" />
		);
		const unmute = (
			<MenuItem
				onClick={viewModel.handleUnmute}
				key="unmute"
				icon="octicon:unmute-24"
				label="Unmute"
			/>
		);
		const makeAdmin = (
			<MenuItem
				onClick={viewModel.handleMakeAdmin}
				key="make_admin"
				icon="mdi:gear"
				label="Make Admin"
			/>
		);
		const takeAdmin = (
			<MenuItem
				onClick={viewModel.handleTakeAdmin}
				label="Take Admin"
				icon="pepicons-pop:gear-off"
				key="take_admin"
			/>
		);

		let isMuted = false;

		if (viewModel.isLoading) {
			return (
				<div className="flex items-center justify-center">
					<MoonLoader color="black" size="30px" />
				</div>
			);
		}

		if (viewModel.context?.userInfo?.type == "member") {
			return null;
		}

		if (props.member.muteStart) {
			const end = moment(props.member.muteEnd);
			isMuted = moment().isBefore(end);
		}

		if (props.member.type == "owner") {
			return [];
		}

		if (viewModel.context?.userInfo?.type == "owner") {
			if (props.member.banned) {
				return [kick, unban];
			}
			if (props.member.type == "member") {
				return [kick, ban, makeAdmin, isMuted ? unmute : mute];
			}
			if (props.member.type == "admin") {
				return [kick, ban, takeAdmin, isMuted ? unmute : mute];
			}
		}

		if (viewModel.context?.userInfo?.type == "admin") {
			if (props.member.banned) {
				if (props.member.type == "admin") {
					return [unban];
				}
				return [kick, unban];
			}
			if (props.member.type == "member") {
				return [kick, ban, isMuted ? unmute : mute];
			}
		}
	}, [props.member, viewModel.context?.userInfo]);

	const actions = renderActions();

	if (!actions) {
		return <></>;
	}

	return <Menu>{renderActions()}</Menu>;
}
