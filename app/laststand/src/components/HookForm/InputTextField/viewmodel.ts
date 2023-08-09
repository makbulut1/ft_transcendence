import { useFormContext } from "react-hook-form";

export interface InputTextFieldProps {
	name: string;
	className?: string;
	disabled?: boolean;
	type?: "number";
	placeholder?: string;
}

export function useViewModel() {
	const { control } = useFormContext();

	return {
		control,
	};
}
