import { useFormContext } from "react-hook-form";

export interface InputCheckboxProps {
	name: string;
	className?: string;
	disabled?: boolean;
	label?: string;
}

export function useViewModel() {
	const { control } = useFormContext();

	return {
		control,
	};
}
