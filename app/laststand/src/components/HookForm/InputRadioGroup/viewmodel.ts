import { ReactElement } from "react";
import { useFormContext } from "react-hook-form";
import { OptionProps } from "./components/Option/viewmodel";

export interface InputRadioGroupProps {
	name: string;
	children?: ReactElement<OptionProps>[] | ReactElement<OptionProps>;
	className?: string;
	disabled?: boolean;
}

export function useViewModel() {
	const { control } = useFormContext();

	return {
		control,
	};
}
