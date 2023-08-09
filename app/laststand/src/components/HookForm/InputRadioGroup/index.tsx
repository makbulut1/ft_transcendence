import { RadioGroup } from "@headlessui/react";
import { useViewModel, InputRadioGroupProps } from "./viewmodel";
import { Controller } from "react-hook-form";
import { Option } from "./components/Option";

export function InputRadioGroup(props: InputRadioGroupProps) {
	const { control } = useViewModel();

	return (
		<Controller
			name={props.name}
			control={control}
			defaultValue={
				Array.isArray(props.children)
					? props.children?.[0].props.value
					: props.children?.props.value
			}
			render={({ field }) => (
				<RadioGroup
					disabled={props.disabled}
					className={`flex w-full gap-3 ${props.className}`}
					{...field}
				>
					{props.children}
				</RadioGroup>
			)}
		/>
	);
}

InputRadioGroup.Option = Option;
