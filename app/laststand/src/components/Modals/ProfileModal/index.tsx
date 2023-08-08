import * as Tabs from "@radix-ui/react-tabs";
import { BeatLoader } from "react-spinners";
import { AchievementType, MatchHistory } from "@shared/models";
import { getAchievementInfo } from "@shared/constants/achievements";
import { Icon } from "@iconify/react";
import { ProfileModalProps, useViewModel } from "./viewmodel";
import { BaseModal } from "@/components/Modals";
import * as Tooltip from "@radix-ui/react-tooltip";
import { FormProvider } from "@/contexts/FormContext";
import { InputTextField } from "@/components/HookForm/InputTextField";
import { InputCheckbox } from "@/components/HookForm/InputCheckbox";

export function ProfileModal(props: ProfileModalProps) {
	const viewModel = useViewModel(props);

	if (viewModel.isFetching) {
		<div className="w-full h-full">
			<BeatLoader color="black" />
		</div>;
	}

	if (!viewModel.profile) {
		return <div>User couldn't find.</div>;
	}

	function renderTab(label: string, value: string) {
		return (
			<Tabs.Trigger
				className="bg-slate-200 flex-1 rounded-none flex items-center justify-center text-sm text-black hover:bg-slate-500 hover:text-white data-[state=active]:text-white data-[state=active]:bg-slate-700 data-[state=active]:focus:shadow-black outline-none"
				value={value}
			>
				{label}
			</Tabs.Trigger>
		);
	}

	function renderMatchHistory(history: MatchHistory, index: number) {
		let playerScore = 0;
		let opponentScore = 0;
		let opponentName = "";

		function renderStatus() {
			let icon = "";
			if (history.player1Name == viewModel.profile?.name) {
				opponentName = history.player2Name;
				playerScore = history.player1Score;
				opponentScore = history.player2Score;
			} else {
				opponentName = history.player1Name;
				playerScore = history.player2Score;
				opponentScore = history.player1Score;
			}

			if (playerScore > opponentScore) {
				icon = "akar-icons:victory-hand";
			} else if (playerScore == opponentScore) {
				icon = "material-symbols:equal";
			} else {
				icon = "la:sad-tear";
			}

			return (
				<div className="flex gap-3">
					<div className="italic text-xl text-yellow-600 font-bold">
						{Math.max(playerScore, opponentScore)}-
						{Math.min(playerScore, opponentScore)}
					</div>
					<Icon fontSize={30} icon={icon} />
				</div>
			);
		}

		function renderPlayers() {
			return (
				<div className="flex gap-3 items-center">
					<Icon icon="fluent-emoji-high-contrast:vs-button" />
					<div>{opponentName}</div>
				</div>
			);
		}

		return (
			<li key={index} className="w-full bg-slate-200 p-3 rounded-lg flex justify-between">
				{renderStatus()}
				{renderPlayers()}
			</li>
		);
	}

	function renderActions() {
		if (props.interact !== undefined && props.interact != true) {
			return;
		}

		if (viewModel.isActionLoading) {
			return (
				<button className="bg-yellow-700">
					<BeatLoader color="white" />
				</button>
			);
		}

		if (viewModel.auth.username == viewModel.profile?.name) {
			function renderEditMode() {
				return (
					<>
						<button
							onClick={viewModel.handleSaveClick}
							className="shadow-none hover:bg-white/30 m-1"
						>
							<Icon icon="material-symbols:save" fontSize={30} />
						</button>
						<button
							onClick={viewModel.handleCancelEditClick}
							className="shadow-none hover:bg-white/30 m-1"
						>
							<Icon icon="charm:cross" fontSize={30} />
						</button>
					</>
				);
			}

			function renderViewMode() {
				return (
					<button
						onClick={viewModel.handleEditClick}
						className="shadow-none hover:bg-white/30 m-1"
					>
						<Icon icon="ph:gear" fontSize={30} />
					</button>
				);
			}

			return (
				<div className="w-full flex justify-end">
					{viewModel.editMode ? renderEditMode() : renderViewMode()}
				</div>
			);
		}

		function renderFriendButton() {
			if (viewModel.profile?.isBlocked) {
				return <></>;
			}

			if (viewModel.profile?.isFriend) {
				return (
					<button
						onClick={viewModel.handleFriendRemoveClick}
						className="bg-red-600 hover:bg-red-700"
					>
						Remove friend
					</button>
				);
			}

			if (viewModel.profile?.friendRequest == "outgoing") {
				return (
					<button
						onClick={viewModel.handleCancelRequestClick}
						className="bg-slate-600 hover:bg-slate-700"
					>
						Cancel request
					</button>
				);
			}

			if (viewModel.profile?.friendRequest == "incoming") {
				return (
					<div className="flex gap-2 items-center">
						<button
							onClick={viewModel.handleApproveClick}
							className="bg-green-600 hover:bg-green-700"
						>
							Approve request
						</button>
						<button
							onClick={viewModel.handleDenyClick}
							className="bg-red-600 hover:bg-red-700"
						>
							Deny request
						</button>
					</div>
				);
			}

			return (
				<button
					onClick={viewModel.handleFriendRequestClick}
					className="bg-green-600 hover:bg-green-700"
				>
					Friend request
				</button>
			);
		}
		function renderBlockButton() {
			if (viewModel.profile?.isBlocked) {
				return (
					<button
						onClick={viewModel.handleUnblockClick}
						className="bg-red-600 hover:bg-red-700"
					>
						Unblock
					</button>
				);
			}
			return (
				<button
					onClick={viewModel.handleBlockClick}
					className="bg-red-600 hover:bg-red-700"
				>
					Block
				</button>
			);
		}
		function renderInviteGameButton() {
			return (
				<button
					onClick={viewModel.handleInviteGameClick}
					className="bg-emerald-600 hover:bg-emerald-700"
				>
					Invite to game
				</button>
			);
		}

		return (
			<div className="w-full flex px-2 justify-end my-1 gap-3 text-white">
				{renderFriendButton()}
				{renderBlockButton()}
				{renderInviteGameButton()}
			</div>
		);
	}

	function renderAchievement(type: AchievementType) {
		let icon = "";
		switch (type) {
			case AchievementType.firstBlood:
				icon = "healthicons:blood-ab-p-outline";
				break;
		}

		return (
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<div className="border-2 border-slate-300 w-fit rounded-lg p-1 shadow-lg transition-all duration-300 hover:translate-y-[-3px] hover:cursor-pointer">
							<Icon icon={icon} fontSize={50} />
						</div>
					</Tooltip.Trigger>
					<Tooltip.Portal>
						<Tooltip.Content>
							<Tooltip.Arrow />
							<div className="bg-black/70 text-white rounded-sm p-2">
								{getAchievementInfo(type)}
							</div>
						</Tooltip.Content>
					</Tooltip.Portal>
				</Tooltip.Root>
			</Tooltip.Provider>
		);
	}

	function renderName() {
		if (viewModel.editMode) {
			return <InputTextField name="name" className="w-2/4 self-center m-2" />;
		}

		return <div className="font-bold w-full text-center mt-2">{viewModel.profile?.name}</div>;
	}

	function renderOption() {
		if (viewModel.editMode) {
			return (
				<InputCheckbox
					className="text-black ml-3 mt-3"
					label="Two factor authentication enabled"
					name="twoFactorAuthEnabled"
				/>
			);
		}
		return <></>;
	}

	function renderImage() {
		let url = viewModel.profile?.avatar;
		if (viewModel.formAvatarValue) {
			url = URL.createObjectURL(viewModel.formAvatarValue);
		}

		const img = (
			<img
				src={viewModel.profile?.avatar}
				className="transition-all duration-300 drop-shadow-xl right-[10px] w-32 h-32 object-cover rounded-full bg-white"
			/>
		);
		if (viewModel.editMode) {
			return (
				<div className="relative drop-shadow-xl overflow-hidden rounded-full bg-white">
					<div
						onClick={viewModel.handleAvatarUploadClick}
						className="transition-all flex flex-col duration-300 absolute w-full items-center justify-center bg-black/50 border-none h-2/12 bottom-0 hover:bg-black/70 hover:cursor-pointer"
					>
						<Icon
							icon="material-symbols:camera"
							className="text-white/50"
							fontSize={40}
						/>
					</div>
					<input
						onChange={viewModel.handleAvatarUploaded}
						accept="image/png, image/gif, image/jpeg"
						ref={viewModel.avatarFileInputRef}
						type="file"
						hidden
					/>
					<img src={url} className="w-32 h-32 object-cover" />
				</div>
			);
		}

		return img;
	}

	return (
		<BaseModal className="p-0 bg-slate-300" {...viewModel.baseProps}>
			<FormProvider methods={viewModel.form} onSubmit={(e) => e.preventDefault()}>
				<div className="flex flex-col gap-3 w-[400px] text-black overflow-hidden">
					<div className="flex flex-col">
						<div className="flex items-center justify-center w-full mt-3">
							{renderImage()}
						</div>
						{renderName()}
						{renderOption()}
						<div className="flex justify-evenly w-full">{renderActions()}</div>
					</div>
					<Tabs.Root defaultValue="matches">
						<Tabs.List className="flex my-3">
							{renderTab("Matches", "matches")}
							{renderTab("Achievements", "achievements")}
						</Tabs.List>
						<Tabs.Content
							className="data-[state=inactive]:hidden data-[state=active]:block p-5 rounded-lg bg-white flex flex-col gap-3"
							value="matches"
						>
							<div className="mx-3 flex justify-between italic font-bold text-xl">
								<div className="text-green-700">
									Wins: {viewModel.profile?.wins}
								</div>
								<div className="text-red-700">
									Losses: {viewModel.profile?.losses}
								</div>
							</div>
							<ul className="px-2 flex flex-col max-h-[160px] gap-3 overflow-y-auto">
								{viewModel.profile?.matchHistories.map((x, i) =>
									renderMatchHistory(x, i),
								)}
							</ul>
						</Tabs.Content>
						<Tabs.Content
							className="data-[state=inactive]:hidden data-[state=active]:block p-5 rounded-lg bg-white flex flex-col gap-3"
							value="achievements"
						>
							<div className="grid gap-3 grid-cols-[repeat(3,1fr)] grid-rows-[repeat(3,1fr)] w-full max-h-[160px] overflow-y-auto">
								{viewModel.profile.achievements.map((x, i) => (
									<div
										key={i}
										className="w-full h-full flex items-center justify-center"
									>
										{renderAchievement(x.type)}
									</div>
								))}
							</div>
						</Tabs.Content>
					</Tabs.Root>
				</div>
			</FormProvider>
		</BaseModal>
	);
}
