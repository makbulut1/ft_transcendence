import { ProfileModal } from "@/components/Modals/ProfileModal";
import { useAuthStore } from "@/stores/useAuthStore";
import { useModalStore } from "@/stores/useModalStore";
import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface DashboardProps {
	children?: ReactNode;
}

export function useViewModel() {
	const modal = useModalStore();
	const location = useLocation();
	const navigate = useNavigate();
	const auth = useAuthStore();

	function handleLogoutClick() {
		auth.logout();
		navigate("/", { replace: true });
	}
	function handleMyProfileClick() {
		modal.openModal(<ProfileModal interact={location.pathname == "/chat"} />);
	}

	return {
		location,
		auth,
		handleLogoutClick,
		handleMyProfileClick,
	};
}
