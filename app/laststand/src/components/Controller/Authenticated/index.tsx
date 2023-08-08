import { Navigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { AuthenticatedProps, useViewModel } from "./viewmodel";

export function Authenticated(props: AuthenticatedProps) {
	const viewModel = useViewModel();

	if (viewModel.status == "validating" || viewModel.auth?.isLogging) {
		return (
			<div className={`w-screen bg-gray-400 h-screen flex items-center justify-center`}>
				<BeatLoader color="black" />
			</div>
		);
	}

	if (viewModel.status == "error" || viewModel.status == "invalid") {
		if (props.redirect) {
			return <Navigate to={props.redirect} />;
		}
		return <div>Authentication error</div>;
	}

	if (!viewModel.auth.token) {
		if (props.redirect) {
			return <Navigate to={props.redirect} />;
		}
		return <div>You have to login</div>;
	}

	return <>{props.children}</>;
}
