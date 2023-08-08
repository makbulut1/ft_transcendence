import { ChangeEvent } from "react";

export type OnTextFieldChangeFunction = (value: string) => void;

export interface TextFieldProps {
	value?: string;
	onChange?: OnTextFieldChangeFunction;
	disabled?: boolean;
	className?: string;
	type?: "password" | "number";
	placeholder?: string;
}

export function useViewModel(props: TextFieldProps) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		props.onChange?.(e.target.value);
	}

	return {
		handleChange,
	};
}
