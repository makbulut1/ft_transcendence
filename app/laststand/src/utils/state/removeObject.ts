import { Dispatch } from "react";

export function removeObject<T>(setter: Dispatch<React.SetStateAction<T[]>>, fields: Partial<T>) {
	const fieldKeys = Object.keys(fields);
	return setter((old) =>
		old.filter((x) => {
			for (const field of fieldKeys) {
				if (fields[field as keyof T] !== x[field as keyof T]) {
					return true;
				}
			}
			return false;
		}),
	);
}
