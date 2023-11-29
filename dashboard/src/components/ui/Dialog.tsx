import Button from "./Button";

export interface IDialogProps {
	title: string;
	message: string;
	onClose: () => void;
	onConfirm: () => void;
	state: "default" | "loading" | "done";
	error: string | null;
	isDanger?: boolean;
}

export default function DialogBox(props: IDialogProps) {
	return (
		<div className="fixed inset-0 z-[51]">
			<div className="fixed inset-0 bg-black opacity-50" onClick={props.onClose}></div>
			<div className="fixed inset-0 flex place-items-center justify-center">
				<div className="bg-white rounded-md shadow-lg w-[420px] max-w-full">
					<div className="px-7 py-6">
						<h1 className="text-lg font-bold">{props.title}</h1>
						<p className="text-gray-500 my-2 text-bb">{props.message}</p>
						{props.error && <div className="text-red-500">{props.error}</div>}
					</div>
					<div className="flex gap-6 justify-center pb-6">
						<Button
							elementChildren="Cancel"
							elementState="default"
							elementType="button"
							elementStyle="no_border_opaque"
							elementSize="small"
							onClick={props.onClose}
							elementDisabled={props.state === "loading"}
						/>
						<Button
							elementChildren="Confirm"
							elementState={props.state}
							elementType="button"
							elementStyle={props.isDanger ? "danger" : "primary"}
							elementSize="small"
							onClick={props.onConfirm}
							elementDisabled={props.state === "loading"}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
