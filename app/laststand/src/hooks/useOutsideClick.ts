import { MutableRefObject, useEffect, useRef } from "react";

export function useOutsideClick(
	callback: (clicked: HTMLElement) => void,
	ref?: MutableRefObject<HTMLElement | null>,
) {
	if (!ref) {
		ref = useRef<HTMLElement | null>(null);
	}

	useEffect(() => {
		const handleClick = (event: globalThis.MouseEvent) => {
			if (ref?.current && !ref.current.contains(event.target as Node)) {
				callback(event.target as HTMLElement);
			}
		};

		document.addEventListener("click", handleClick, true);

		return () => {
			document.removeEventListener("click", handleClick, true);
		};
	}, [ref.current]);
}
