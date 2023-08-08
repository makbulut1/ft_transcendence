import { FormEventHandler, ReactNode } from "react";
import {
	FormProvider as HookFormProvider,
	UseFormReturn,
} from "react-hook-form";

export interface FormProviderProps {
	children?: ReactNode;
	onSubmit?: FormEventHandler<HTMLFormElement>;
	methods: UseFormReturn<any, any>;
}

export function FormProvider(props: FormProviderProps) {
	return (
		<HookFormProvider {...props.methods}>
			<form className="w-full h-full" onSubmit={props.onSubmit}>
				{props.children}
			</form>
		</HookFormProvider>
	);
}
