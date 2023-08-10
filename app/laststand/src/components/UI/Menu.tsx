import {
	autoUpdate,
	flip,
	FloatingFocusManager,
	FloatingList,
	FloatingNode,
	FloatingOverlay,
	FloatingPortal,
	FloatingTree,
	offset,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useFloatingNodeId,
	useFloatingParentNodeId,
	useFloatingTree,
	useInteractions,
	useListItem,
	useListNavigation,
	useMergeRefs,
	useRole,
	useTypeahead,
} from "@floating-ui/react";
import { Icon } from "@iconify/react";
import * as React from "react";

const MenuContext = React.createContext<{
	getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
	activeIndex: number | null;
	setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
	isOpen: boolean;
}>({
	getItemProps: () => ({}),
	activeIndex: null,
	setActiveIndex: () => {},
	isOpen: false,
});

interface MenuProps {
	label?: string;
	children?: React.ReactNode;
	button?: React.ReactNode;
}

export const MenuComponent = React.forwardRef<
	HTMLButtonElement,
	MenuProps & React.HTMLProps<HTMLButtonElement>
>(({ children, label, button, ...props }, forwardedRef) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

	const elementsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
	const labelsRef = React.useRef<Array<string | null>>([]);
	const parent = React.useContext(MenuContext);

	const tree = useFloatingTree();
	const nodeId = useFloatingNodeId();
	const parentId = useFloatingParentNodeId();
	const item = useListItem();

	const { floatingStyles, refs, context } = useFloating<HTMLButtonElement>({
		nodeId,
		open: isOpen,
		onOpenChange: setIsOpen,
		middleware: [offset({ mainAxis: 4, alignmentAxis: 0 }), flip(), shift()],
		whileElementsMounted: autoUpdate,
	});

	const click = useClick(context, {
		event: "mousedown",
		toggle: true,
		ignoreMouse: false,
	});
	const role = useRole(context, { role: "menu" });
	const dismiss = useDismiss(context, { bubbles: true });
	const listNavigation = useListNavigation(context, {
		listRef: elementsRef,
		activeIndex,
		onNavigate: setActiveIndex,
	});
	const typeahead = useTypeahead(context, {
		listRef: labelsRef,
		onMatch: isOpen ? setActiveIndex : undefined,
		activeIndex,
	});

	const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
		click,
		role,
		dismiss,
		listNavigation,
		typeahead,
	]);

	// Event emitter allows you to communicate across tree components.
	// This effect closes all menus when an item gets clicked anywhere
	// in the tree.
	React.useEffect(() => {
		if (!tree) return;

		function handleTreeClick() {
			setIsOpen(false);
		}

		function onSubMenuOpen(event: { nodeId: string; parentId: string }) {
			if (event.nodeId !== nodeId && event.parentId === parentId) {
				setIsOpen(false);
			}
		}

		tree.events.on("click", handleTreeClick);
		tree.events.on("menuopen", onSubMenuOpen);

		return () => {
			tree.events.off("click", handleTreeClick);
			tree.events.off("menuopen", onSubMenuOpen);
		};
	}, [tree, nodeId, parentId]);

	React.useEffect(() => {
		if (isOpen && tree) {
			tree.events.emit("menuopen", { parentId, nodeId });
		}
	}, [tree, isOpen, nodeId, parentId]);

	return (
		<FloatingNode id={nodeId}>
			<button
				ref={useMergeRefs([refs.setReference, item.ref, forwardedRef])}
				className="flex items-center justify-center p-1 hover:bg-slate-400 rounded-full h-[50px] w-[50px] shadow-none"
				{...getReferenceProps(
					parent.getItemProps({
						...props,
						onFocus(event: React.FocusEvent<HTMLButtonElement>) {
							props.onFocus?.(event);
						},
					}),
				)}
			>
				{button ? (
					button
				) : (
					<>
						{label}
						<Icon icon="bi:three-dots-vertical" />
					</>
				)}
			</button>
			<MenuContext.Provider
				value={{
					activeIndex,
					setActiveIndex,
					getItemProps,
					isOpen,
				}}
			>
				<FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
					{isOpen && (
						<FloatingPortal>
							<FloatingOverlay lockScroll>
								<FloatingFocusManager
									context={context}
									modal={true}
									initialFocus={1}
									returnFocus={false}
								>
									<div
										ref={refs.setFloating}
										className=" divide-gray-100 rounded-md bg-white shadow-lg flex flex-col w-[160px] overflow-hidden"
										style={floatingStyles}
										{...getFloatingProps()}
									>
										{children}
									</div>
								</FloatingFocusManager>
							</FloatingOverlay>
						</FloatingPortal>
					)}
				</FloatingList>
			</MenuContext.Provider>
		</FloatingNode>
	);
});

interface MenuItemProps {
	label: string;
	icon?: string;
	disabled?: boolean;
}

export const MenuItem = React.forwardRef<
	HTMLButtonElement,
	MenuItemProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ label, disabled, icon, ...props }, forwardedRef) => {
	const menu = React.useContext(MenuContext);
	const item = useListItem({ label: disabled ? null : label });
	const tree = useFloatingTree();

	return (
		<button
			{...props}
			ref={useMergeRefs([item.ref, forwardedRef])}
			role="menuitem"
			className="transition-all duration-300 hover:bg-blue-500 hover:cursor-pointer justify-start p-3 flex gap-2 items-center rounded-none shadow-none"
			disabled={disabled}
			{...menu.getItemProps({
				onClick(event: React.MouseEvent<HTMLButtonElement>) {
					props.onClick?.(event);
					tree?.events.emit("click");
				},
				onFocus(event: React.FocusEvent<HTMLButtonElement>) {
					props.onFocus?.(event);
				},
			})}
		>
			{icon && <Icon icon={icon} />}
			{label}
		</button>
	);
});

export const Menu = React.forwardRef<
	HTMLButtonElement,
	MenuProps & React.HTMLProps<HTMLButtonElement>
>((props, ref) => {
	const parentId = useFloatingParentNodeId();

	if (parentId === null) {
		return (
			<FloatingTree>
				<MenuComponent {...props} ref={ref} />
			</FloatingTree>
		);
	}

	return <MenuComponent {...props} ref={ref} />;
});
