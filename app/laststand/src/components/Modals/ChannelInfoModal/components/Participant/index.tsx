import { Avatar } from "@/components/UI/Avatar";
import { Icon } from "@iconify/react";
import { ActionMenu } from "../ActionMenu";
import { ParticipantProps, useViewModel } from "./viewmodel";

export function Participant(props: ParticipantProps) {
	const viewModel = useViewModel(props);

	function renderMemberIcon() {
		let icon: string = "";

		if (props.member.banned) {
			icon = "material-symbols:block";
		} else {
			switch (props.member.type) {
				case "admin":
					icon = "mdi:gear";
					break;
				case "owner":
					icon = "mdi:crown";
					break;
				case "member":
					icon = "material-symbols:person";
					break;
			}
		}

		return (
			<>
				<Icon icon={icon} />
				{viewModel.leftMinute >= 0 && (
					<div className="flex items-center">
						(<Icon icon="mdi:mute" />
						<div className="mx-1" />
						<div>{viewModel.leftMinute}</div> min)
					</div>
				)}
			</>
		);
	}

	return (
		<li className="p-4 bg-slate-300 rounded-lg flex justify-between">
			<div className="flex items-center gap-3">
				<Avatar user={props.member.user} />
				<div>{props.member.user.name}</div>
				{renderMemberIcon()}
			</div>
			<ActionMenu member={props.member} />
		</li>
	);
}
