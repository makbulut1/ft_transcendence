import { BeatLoader, ClimbingBoxLoader } from "react-spinners";
import { useViewModel } from "./viewmodel";
import { Dashboard } from "@/layouts/Dashboard";
import { RadioGroup, Transition } from "@headlessui/react";

export function MatchMakerPage() {
	const viewModel = useViewModel();

	function renderContent() {
		if (viewModel.state == "loading") {
			return <BeatLoader color="black" />;
		}

		if (viewModel.state == "waiting") {
			return (
				<div className="flex flex-col gap-3 text-black">
					Match finding...
					<ClimbingBoxLoader color="black" />
					<button
						className="text-white bg-indigo-700 hover:bg-indigo-800"
						onClick={viewModel.handleCancelClick}
					>
						Cancel
					</button>
				</div>
			);
		}

		if (viewModel.state == "match_found") {
			return (
				<div className="text-black flex flex-col items-center justify-center gap-3">
					<Transition
						appear
						show={!!viewModel.rival}
						className="flex flex-col gap-3 items-center justify-center"
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<img
							src={viewModel.rival?.avatar}
							className="transition-all duration-300 shadow-xl border-2 border-slate-400 w-[80px] h-[80px] object-cover rounded-full"
						/>
						{viewModel.rival?.name}
					</Transition>
					<div className="font-bold text-2xl italic">{viewModel.countdown}</div>
				</div>
			);
		}

		return (
			<>
				<div className="flex flex-col">
					<div className="text-black">Map:</div>
					<RadioGroup
						className="flex gap-3"
						value={viewModel.map}
						onChange={viewModel.handleMapChange}
					>
						<RadioGroup.Option className="flex-1" value="default">
							{({ checked }) => (
								<div
									className={`hover:cursor-pointer shadow-lg p-3 rounded-lg transition-all duration-100 bg-slate-400 text-black w-full h-full ${
										checked && "bg-slate-500 text-white"
									}`}
								>
									Default
								</div>
							)}
						</RadioGroup.Option>
						<RadioGroup.Option className="flex-1" value="neverland">
							{({ checked }) => (
								<div
									className={`hover:cursor-pointer shadow-lg p-3 rounded-lg transition-all duration-100 bg-slate-400 text-black w-full h-full ${
										checked && "bg-slate-500 text-white"
									}`}
								>
									Neverland
								</div>
							)}
						</RadioGroup.Option>
					</RadioGroup>
				</div>

				<button
					className="bg-indigo-700 hover:bg-indigo-800"
					onClick={viewModel.handleFindMatchClick}
				>
					Find match
				</button>
			</>
		);
	}

	return (
		<Dashboard>
			<div className="flex items-center justify-center h-screen bg-gray-500 w-full text-white">
				<div className="items-center justify-center bg-white rounded-lg p-10 shadow-xl flex flex-col gap-3">
					{renderContent()}
				</div>
			</div>
		</Dashboard>
	);
}
