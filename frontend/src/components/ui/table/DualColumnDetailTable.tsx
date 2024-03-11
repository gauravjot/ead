export interface IDualColumnTableProps {
	left: {title: string; value: string}[];
	right: {title: string; value: string}[];
}

export function DualColumnTable(props: IDualColumnTableProps) {
	return (
		<div className="grid grid-cols-2 gap-10 text-gray-600 text-bb">
			<div>
				{props.left.map((item, index) => (
					<div className="grid grid-cols-6 my-1" key={"left" + index}>
						<div className="col-span-2 font-medium">{item.title}</div>
						<div className="col-span-4">{item.value}</div>
					</div>
				))}
			</div>
			<div>
				{props.right.map((item, index) => (
					<div className="grid grid-cols-6 my-1" key={"left" + index}>
						<div className="col-span-2 font-medium">{item.title}</div>
						<div className="col-span-4">{item.value}</div>
					</div>
				))}
			</div>
		</div>
	);
}
