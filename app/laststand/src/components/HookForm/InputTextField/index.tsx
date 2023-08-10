import { Controller } from "react-hook-form";
import { useViewModel, InputTextFieldProps } from "./viewmodel";
import { TextField } from "@/components/UI/TextField";

export function InputTextField(props: InputTextFieldProps) {
	const viewModel = useViewModel();

	return (
		<Controller
			defaultValue=""
			name={props.name}
			control={viewModel.control}
			render={({ field, fieldState: { error } }) => (
				<div className="flex flex-col w-full gap-2">
					<TextField
						{...field}
						className={props.className}
						placeholder={props.placeholder}
						type={props.type}
						disabled={props.disabled}
					/>
					{error && <div className="text-red-700 italic">{error.message}</div>}
				</div>
			)}
		/>
	);
}
