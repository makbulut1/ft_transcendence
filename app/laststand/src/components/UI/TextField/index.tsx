import { forwardRef } from "react";
import { TextFieldProps, useViewModel } from "./viewmodel";

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
	const viewModel = useViewModel(props);

	return (
		<input
			ref={ref}
			disabled={props.disabled}
			placeholder={props.placeholder}
			type={props.type}
			value={props.value}
			onChange={viewModel.handleChange}
			className={`bg-space-300 rounded-lg shadow-md outline-none focus:outline-space-100 p-3 outline-gray-300 ${props.className}`}
		/>
	);
});
