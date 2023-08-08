import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
	children?: ReactNode;
	rootId: string;
}

export function Portal(props: PortalProps) {
	const portal = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const root = document.getElementById("root");
		let portalElem = document.getElementById(props.rootId);
		if (!portalElem && root) {
			portalElem = document.createElement("div");
			portalElem.setAttribute("id", props.rootId);
			root.append(portalElem);
			portal.current = portalElem;
		}

		return () => {
			if (portal.current) {
				portal.current.remove();
			}
		};
	}, [props.rootId]);

	if (!portal.current) {
		portal.current = document.createElement("div");
	}

	return createPortal(props.children, portal.current);
}
