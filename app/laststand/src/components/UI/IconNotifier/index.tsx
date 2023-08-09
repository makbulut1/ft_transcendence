import { IconNotifierProps } from "./viewmodel";
import { Icon } from "@iconify/react";

export function IconNotifier(props: IconNotifierProps) {
	return (
		<div
			className={`flex flex-col w-full items-center justify-center gap-3 text-[13px] sm:text-[14px] md:text-[16px] ${
				props.color == "white" ? "text-white" : "text-black"
			}`}
		>
			<Icon icon={props.icon} fontSize="35px" />
			{props.message && <div>{props.message}</div>}
		</div>
	);
}
