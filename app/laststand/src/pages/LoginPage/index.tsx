import { useViewModel } from "./viewmodel";
import { Navigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

export function LoginPage() {
	const viewModel = useViewModel();

	if (localStorage.getItem("client_token")) {
		return <Navigate to="/chat" />;
	}

	function renderContent() {
		if (viewModel.auth.isLogging) {
			return <BeatLoader color="black" />;
		}

		if (viewModel.tfaEnabled) {
			return (
				<div className="flex flex-col gap-3">
					<div>Enter two factor authentication code:</div>
					<input
						className="tracking-[20px] border-2 border-slate-300 shadow-lg rounded-lg p-1"
						type="text"
						value={viewModel.tfaCode}
						onChange={viewModel.handleTfaInputChange}
					/>
					<button
						onClick={viewModel.handleVerifyCodeClick}
						className="bg-slate-400 text-white hover:bg-slate-500"
					>
						Verify
					</button>
				</div>
			);
		}

		return (
			<>
				<div>
					Welcome to{" "}
					<b>
						<i>Laststand</i>
					</b>
					!
				</div>
				<a
					href={`https://api.intra.42.fr/oauth/authorize?${new URLSearchParams({
						client_id: import.meta.env.VITE_INTRA_UID,
						redirect_uri: `http://${import.meta.env.VITE_HOST}:${
							import.meta.env.VITE_HOST_PORT
						}`,
						response_type: "code",
					}).toString()}`}
				>
					<button className="bg-gray-600 hover:bg-gray-700 text-white">
						Login with Intra 42
					</button>
				</a>
			</>
		);
	}

	return (
		<div className="flex items-center justify-center h-screen w-screen bg-black">
			<div className="flex flex-col p-3 bg-white rounded-lg gap-3 items-center justify-center">
				<img className="w-4/12" src="/logo.png" />
				{renderContent()}
			</div>
		</div>
	);
}
