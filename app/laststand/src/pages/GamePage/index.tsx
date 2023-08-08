import { Dashboard } from "@/layouts/Dashboard";
import { useViewModel } from "./viewmodel";
import { Navigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

export function GamePage() {
	const viewModel = useViewModel();

	if (!viewModel.token) {
		return <Navigate to="/" />;
	}

	function renderMatchOver() {
		function renderStatus() {
			if (viewModel.state == "win") {
				return <div>You win!</div>;
			} else if (viewModel.state == "lose") {
				return <div>You lose...</div>;
			}
		}

		if (viewModel.state == "win" || viewModel.state == "lose") {
			return (
				<div className="bg-white p-2 rounded-lg text-black flex flex-col items-center justify-center gap-3 w-fit h-fit">
					<div>Game over</div>
					{renderStatus()}
					<button className="bg-indigo-500 hover:bg-indigo-600 text-white">
						<a className="no-underline" href="/matchmaker">
							Return to matchmaker
						</a>
					</button>
				</div>
			);
		}
	}

	function renderContent() {
		if (viewModel.state == "waiting") {
			return (
				<div className="text-white text-2xl flex flex-col gap-3 items-center justify-center">
					Waiting for other player to join
					<BeatLoader color="white" />
				</div>
			);
		}

		function renderScore() {
			return (
				<div className="font-bold text-3xl text-white italic flex justify-between w-full m-3">
					<div className="flex gap-3 items-center">
						<img
							src={viewModel.leftPlayerInfo?.avatar}
							className="w-[50px] h-[50px] object-cover rounded-full bg-white"
						/>
						{viewModel.leftPlayerInfo?.score}
					</div>
					<div className="flex-1" />
					<div className="flex gap-3 items-center">
						{viewModel.rightPlayerInfo?.score}
						<img
							src={viewModel.rightPlayerInfo?.avatar}
							className="w-[50px] h-[50px] object-cover rounded-full bg-white"
						/>
					</div>
				</div>
			);
		}

		return (
			<div
				style={{
					width: "700px",
					height: "400px",
				}}
				className="flex flex-col gap-3 relative items-center"
			>
				{renderScore()}
				<div className="flex items-center justify-center absolute left-0 top-0 w-full h-full">
					{renderMatchOver()}
				</div>
				<div className="h-[50px]" />
				<canvas
					ref={viewModel.canvasRef}
					width={viewModel.gameData.canvasSize.w}
					height={viewModel.gameData.canvasSize.h}
					className="border-2 w-[calc(100%-100px)]"
				/>
			</div>
		);
	}

	return (
		<Dashboard>
			<div className="w-full h-screen flex items-center justify-center bg-black">
				{renderContent()}
			</div>
		</Dashboard>
	);
}
