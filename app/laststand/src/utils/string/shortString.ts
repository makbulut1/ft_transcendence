export function shortString(
	str?: string,
	maxLength?: number
): string | undefined {
	if (!str || !maxLength) {
		return;
	}
	return str.substring(0, maxLength) + (str.length > maxLength ? "..." : "");
}
