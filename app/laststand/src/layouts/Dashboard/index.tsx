import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DashboardProps } from "@/layouts/Dashboard/viewmodel";
import { Icon } from "@iconify/react";
import { useViewModel } from "./viewmodel";

export function Dashboard(props: DashboardProps) {
	const viewModel = useViewModel();

	function renderNavigateButton(label: string, href: string, icon: string) {
		return (
			<a href={href}>
				<div
					className={`w-[50px] flex-col md:flex-row md:w-[100px] md:h-[50px] flex items-center gap-2 shadow-xl transition-all duration-300 p-3 rounded-full hover:cursor-pointer hover:bg-slate-700 border-2 border-slate-400/40 hover:border-slate-300/40 hover:text-white ${
						viewModel.location.pathname == href
							? "bg-slate-700 text-white"
							: "bg-slate-100 text-black"
					}`}
				>
					<Icon icon={icon} fontSize={18} />
					<div className="hidden md:block">{label}</div>
				</div>
			</a>
		);
	}

	function renderProfileMenuItem(label: string, icon?: string, onClick?: () => void) {
		return (
			<DropdownMenu.Item
				onClick={onClick}
				className="transition-all duration-300 p-4 text-sm gap-2 text-black rounded-[3px] flex items-center h-[50px] select-none outline-none data-[highlighted]:bg-slate-700 data-[highlighted]:text-white data-[highlighted]:cursor-pointer"
			>
				{icon && <Icon icon={icon} fontSize={18} />}
				{label}
			</DropdownMenu.Item>
		);
	}

	return (
		<div className="flex flex-col w-screen h-screen">
			<div className="relative flex items-center justify-center bg-slate-500 border-b-2 gap-3 md:gap-5 lg:gap-10 p-3">
				{renderNavigateButton("Chat", "/chat", "bi:chat-fill")}
				{renderNavigateButton("Game", "/matchmaker", "iconoir:archery-match")}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild>
						<img
							src={viewModel.auth.avatar}
							className="hover:border-slate-600 transition-all duration-300 shadow-xl border-2 border-slate-400 absolute right-[10px] w-[50px] h-[50px] object-cover rounded-full bg-white hover:cursor-pointer"
						/>
					</DropdownMenu.Trigger>

					<DropdownMenu.Portal>
						<DropdownMenu.Content
							className="min-w-[100px] bg-white rounded-md p-1 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
							sideOffset={5}
						>
							{renderProfileMenuItem(
								"My Profile",
								"iconamoon:profile",
								viewModel.handleMyProfileClick,
							)}
							{renderProfileMenuItem(
								"Logout",
								"material-symbols:logout",
								viewModel.handleLogoutClick,
							)}
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
			</div>
			{props.children}
		</div>
	);
}
