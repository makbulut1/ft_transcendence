export function clamp(value: number, max: number, min: number): number {
	if (value < min) {
		value = min;
	}
	if (value > max) {
		value = max;
	}
	return value;
}
