import ReactDOM from "react-dom/client";
import router from "@/constants/router";
import { RouterProvider } from "react-router-dom";
import { ModalController } from "@/components/Controller/ModalController";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "@/styles/index.css";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<QueryClientProvider client={queryClient}>
		<ModalController />
		<RouterProvider router={router} />
		<ToastContainer pauseOnFocusLoss={false} position="top-right" autoClose={5000} />
	</QueryClientProvider>,
);
