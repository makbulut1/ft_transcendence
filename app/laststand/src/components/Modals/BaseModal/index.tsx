import { Transition } from "@headlessui/react";
import { BaseModalProps, useViewModel } from "./viewmodel";
import { twMerge } from "tailwind-merge";

export function BaseModal(props: BaseModalProps) {
	const viewModel = useViewModel(props);

	return (
		<Transition appear show={props.open ?? true} as="div">
			<Transition.Child
				onClick={viewModel.handleOnClose}
				className="absolute h-screen w-screen top-0 left-0 inset-0 bg-black/25 flex items-center justify-center p-4"
				as="div"
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<Transition.Child
					onClick={viewModel.handleContentClick}
					className={twMerge(
						`select-text transform rounded-2xl text-black dark:text-white bg-white dark:bg-dark p-6 text-left align-middle shadow-xl transition-all max-h-[calc(100vh-100px)] max-w-[calc(100vw-50x)] ${props.className}`,
					)}
					as="div"
					enter="ease-out duration-300"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					{props.children}
				</Transition.Child>
			</Transition.Child>
		</Transition>
	);
}
