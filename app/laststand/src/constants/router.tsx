import { Authenticated } from "@/components/Controller/Authenticated";
import { ChatPage, LoginPage } from "@/pages";
import { GamePage } from "@/pages/GamePage";
import { MatchMakerPage } from "@/pages/MatchMakerPage";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
	{
		path: "/chat",
		element: (
			<Authenticated redirect="/">
				<ChatPage />
			</Authenticated>
		),
	},
	{
		path: "/matchmaker",
		element: (
			<Authenticated redirect="/">
				<MatchMakerPage />
			</Authenticated>
		),
	},
	{
		path: "/game",
		element: (
			<Authenticated>
				<GamePage />
			</Authenticated>
		),
	},
	{
		path: "/",
		element: <LoginPage />,
	},
]);

export default router;
