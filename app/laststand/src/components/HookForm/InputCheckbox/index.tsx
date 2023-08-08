import { Controller } from "react-hook-form";
import { useViewModel, InputCheckboxProps } from "./viewmodel";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Icon } from "@iconify/react";
import { twMerge } from "tailwind-merge";

export function InputCheckbox(props: InputCheckboxProps) {
	const viewModel = useViewModel();

	return (
		<Controller
			defaultValue={false}
			name={props.name}
			control={viewModel.control}
			render={({ field, fieldState: { error } }) => (
				<div className={twMerge("flex flex-col w-full gap-2", props.className)}>
					<div className="flex items-center">
						<Checkbox.Root
							className="shadow-xl hover:bg-violet3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white"
							onCheckedChange={(checked) => {
								field.onChange(checked);
							}}
							checked={field.value}
						>
							{field.value ? (
								<Checkbox.Indicator>
									<Icon icon="ic:round-check" />
								</Checkbox.Indicator>
							) : (
								<></>
							)}
						</Checkbox.Root>
						<label className="pl-[15px] text-[15px] leading-none">{props.label}</label>
					</div>
					{error && <div className="text-red-700 italic">{error.message}</div>}
				</div>
			)}
		/>
	);
}
