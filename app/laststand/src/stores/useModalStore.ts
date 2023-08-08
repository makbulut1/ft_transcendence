import { BaseModalProps } from "@/components/Modals/BaseModal/viewmodel";
import { ReactElement } from "react";
import { create } from "zustand";

interface ModalItem {
	id: string;
	isOpen: boolean;
	modal: ReactElement<BaseModalProps>;
}

interface ModalStore {
	modals: ModalItem[];
	openModal: (modal: ReactElement<BaseModalProps>, key?: string) => string;
	closeModal: (key?: string) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
	modals: [],
	openModal(modal: ReactElement<BaseModalProps>, key?: string) {
		if (!key) {
			key = (this.modals.length + 1).toString();
		}

		set(({ modals }) => ({
			modals: [...modals, { id: key ?? "", modal: modal, isOpen: true }],
		}));

		return key;
	},
	closeModal(key?: string) {
		set(({ modals }) => {
			if (!key) {
				return {
					modals: [],
				};
			}
			return {
				modals: modals.filter((x) => x.id != key),
			};
		});
	},
}));
