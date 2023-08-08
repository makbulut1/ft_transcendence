import { RadioGroup } from "@headlessui/react";
import { OptionProps } from "./viewmodel";

export function Option(props: OptionProps) {
	return (
		<RadioGroup.Option className="flex-1" value={props.value}>
			{({ checked }) => (
				<div
					className={`hover:cursor-pointer shadow-lg rounded-lg transition-all duration-100 bg-slate-400 text-black w-full h-full ${
						props.className
					} ${checked && "bg-slate-500 text-white"}`}
				>
					{props.children}
				</div>
			)}
		</RadioGroup.Option>
	);
}
