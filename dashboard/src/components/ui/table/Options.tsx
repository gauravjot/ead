import DropDown from "../DropDown";

export default function TableOptions({columns}: {columns: string[]}) {
	return (
		<div className="flex justify-end mt-1">
			<DropDown
				showExpandIcon={false}
				items={[
					{
						title: "a",
						onClick: () => {
							console.log(columns);
						},
					},
				]}
				buttonIcon="ic-options-vertical"
				iconOnly={true}
				buttonStyle="icon_only"
			/>
		</div>
	);
}
