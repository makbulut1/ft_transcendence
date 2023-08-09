import { Dispatch } from "react";

export function addObject<T extends object>(
	setter: Dispatch<React.SetStateAction<T[]>>,
	item: T,
	push?: boolean,
) {
	setter((old) => {
		const index = old.findIndex((x) => {
			const keys = Object.keys(item);
			for (const key of keys) {
				if (x[key as keyof T] != item[key as keyof T]) {
					return false;
				}
			}
			return true;
		});
		if (index == -1) {
			if (push) {
				return [...old, item];
			}
			return [item, ...old];
		}
		return old;
	});
}
