import { get2FaQrCode } from "@/api/raw/get2FaQrCode";
import { BaseModalProps } from "@/components/Modals/BaseModal/viewmodel";
import { useEffect, useState } from "react";

export interface QRModalProps extends Omit<BaseModalProps, "children"> {}

export function useViewModel() {
	const [imageData, setImageData] = useState<string>();

	async function loadQr() {
		setImageData(await get2FaQrCode());
	}

	useEffect(() => {
		loadQr();
	}, []);

	return {
		imageData,
	};
}
