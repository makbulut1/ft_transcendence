import { Dispatch } from "react";

export function changeFields<T>(
	setter: Dispatch<React.SetStateAction<T[]>>,
	fields: Partial<T>,
	primaryKey: keyof T,
	add?: boolean,
) {
	return setter((old) => {
		const newList = [...old];
		const index = newList.findIndex((x) => x[primaryKey] == fields[primaryKey]);

		if (index == -1 && add) {
			newList.push(fields as T);
		} else {
			newList[index] = {
				...newList[index],
				...fields,
			};
		}
		return newList;
	});
}
