import React from "react";
import Spinner from "@/components/ui/Spinner";

interface Props {
	children: React.ReactNode;
	onClick?: () => void;
	styleType: "primary" | "black" | "danger" | "white_opaque";
	state: "default" | "loading" | "done";
	type: "button" | "submit" | "reset";
	size?: "xsmall" | "base" | "small" | "large";
	outline?: boolean;
	disabled?: boolean;
	width?: "auto" | "full";
}

const buttonBaseStyle =
	"leading-[1] shadow font-bold rounded-md pointer hover:outline focus:outline focus:outline-4 hover:outline-4 disabled:outline-0 disabled:opacity-50";

export default function Button(props: Props) {
	const style = {
		primary: props.outline
			? "border border-dodger-600 text-dodger-600 outline-dodger-100 focus:bg-dodger-50"
			: "bg-dodger-600 text-white outline-dodger-100 focus:bg-dodger-700/90",
		black: props.outline
			? "border border-gray-600 text-gray-700 outline-gray-200 focus:bg-gray-50"
			: "bg-gray-900 text-white outline-gray-300 focus:bg-gray-800",
		danger: props.outline
			? "border border-red-600 text-red-600 outline-red-200 focus:bg-red-50"
			: "bg-red-600 text-white outline-red-200 focus:bg-red-700",
		white_opaque: "bg-white/20 text-white outline-white/10 focus:bg-white/50",
	};
	const buttonSizing =
		(props.size === "base"
			? "text-bb py-1.5 px-4"
			: props.size === "xsmall"
			? "text-[0.8rem] py-px px-1.5"
			: props.size === "small"
			? "text-sm py-0.5 px-2"
			: props.size === "large"
			? "text-base py-2.5 px-6"
			: "text-bb py-1.5 px-2") + (props.width === "full" ? " w-full" : "");

	return (
		<button
			onClick={props.onClick}
			className={
				buttonBaseStyle + " " + style[props.styleType] + " " + buttonSizing
			}
			disabled={props.disabled}
		>
			{props.state === "default" ? (
				<span className="inline-block py-[0.36rem]">{props.children}</span>
			) : props.state === "loading" ? (
				<Spinner size="sm" color={props.outline ? "black" : "white"} />
			) : (
				<span
					className={
						"ic-lg ic-done " + (props.outline ? "ic-black" : "ic-white")
					}
				></span>
			)}
		</button>
	);
}
