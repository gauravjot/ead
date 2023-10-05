import { useCallback, useRef, useState } from "react";

export type DropDownItemType = { title: string; onClick: () => void; icon?: string };

interface Props {
	showExpandIcon: boolean;
	buttonIcon?: string;
	buttonText?: string;
	items: DropDownItemType[];
  iconOnly?: boolean;
  buttonStyle?: "default" | "icon_only";
}

export default function DropDown(props: Props) {
	const [dropDownActive, setDropDownActive] = useState<boolean>(false);
	const dropDownButtonRef = useRef<HTMLButtonElement>(null);
	const dropDownMenuRef = useRef<HTMLDivElement>(null);

	const toggleEventHandler = useCallback((e: MouseEvent) => {
		/* useCallback so function doesnt change in re-renders
       otherwise our add/remove eventListeners will go haywire */
		if (
			!dropDownMenuRef.current?.contains(e.target as Node) &&
			!dropDownButtonRef.current?.contains(e.target as Node)
		) {
			dropDownMenuRef.current?.setAttribute("aria-expanded", "false");
			setDropDownActive(false);
		}
	}, []);
	if (dropDownActive) {
		// Detect clicks outside of filter box
		window.addEventListener("click", toggleEventHandler);
	} else {
		window.removeEventListener("click", toggleEventHandler);
	}

  const buttonStyle = (props.buttonStyle === "icon_only") ? 
    "rounded-md bg-white hover:bg-gray-100 h-8 w-8 flex place-items-center justify-center" 
    : "bg-dodger-600/90 hover:bg-dodger-500 flex place-items-center"+
      " text-sm text-white px-2 py-1 rounded-md shadow-md border border-dodger-600";

	return (
		<div className="relative">
			<button
				ref={dropDownButtonRef}
				aria-expanded={dropDownActive}
				onClick={() => {
					setDropDownActive((val) => !val);
				}}
				className={buttonStyle}
			>
				{props.buttonIcon && (
					<span className={"ic-md " + props.buttonIcon + (props.iconOnly ? " ic-gray-50" : " ic-white")}></span>
				)}
				{props.buttonText && (
					<span className="pl-2 pr-4">{props.buttonText}</span>
				)}
				{props.showExpandIcon && (
					<span className="ic ic-white ic-down-arrow"></span>
				)}
			</button>
			<div
				ref={dropDownMenuRef}
				aria-hidden={!dropDownActive}
				className="aria-hidable absolute z-50 bg-white top-8 right-0 min-w-[12rem] flex flex-col rounded-md shadow-md px-1 py-0.5 border border-gray-200"
			>
				{props.items.map((item) => {
					return (
						<button
							onClick={item.onClick}
							key={item.title}
							className="text-left w-full py-1 px-3 my-1 flex place-items-center gap-2.5 hover:bg-gray-50 rounded focus:outline hover:outline hover:outline-1 focus:outline-dodger-600 hover:outline-gray-200 focus:outline-2"
						>
							{item.icon && (
								<span className={"ic ic-gray-75 " + item.icon}></span>
							)}
							<span className="text-sm">{item.title}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
