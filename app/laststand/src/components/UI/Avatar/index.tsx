import { AvatarProps, useViewModel } from "./viewmodel";

export function Avatar(props: AvatarProps) {
	const viewModel = useViewModel(props);

	function getStatusColor() {
		switch (viewModel.status) {
			case "ingame":
				return "bg-yellow-600";
			case "online":
				return "bg-green-600";
			case "offline":
				return "bg-red-600";
		}
	}

	return (
		<div className="relative">
			{viewModel.status && (
				<div
					className={`absolute w-[10px] h-[10px] rounded-full right-0 top-[-3px] ${getStatusColor()}`}
				/>
			)}

			{props.user?.avatar ? (
				<img
					onClick={viewModel.handleClick}
					src={props.user.avatar}
					className="transition-all duration-300 drop-shadow-xl right-[10px] w-[50px] h-[50px] object-cover rounded-full bg-white hover:cursor-pointer border-2 hover:border-slate-500"
				/>
			) : (
				<div className="flex items-center overflow-hidden rounded-full w-[50px] h-[50px]">
					<div className="flex items-center justify-center text-xl text-black font-bold w-full h-full bg-blue-200 rounded-full border-2 border-black">
						#
					</div>
				</div>
			)}
		</div>
	);
}
