// NOTE: "LS" stands for "Laststand"
export interface LSError {
	message: string;
	code: number | string;
	info?: any[] | any;
}
