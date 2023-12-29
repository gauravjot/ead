import {AdminContext} from "@/components/Home";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/table/Table";
import {getItems} from "@/services/item/get_items";
import {Dispatch, SetStateAction, useContext, useState} from "react";
import {useQuery} from "react-query";
import ViewItem from "./ViewItem";

export default function ItemsList({
	id,
	template,
	setShowAddItemBox,
}: {
	id: number | string;
	template: {n: string; t: string}[] | null;
	setShowAddItemBox: Dispatch<SetStateAction<boolean>>;
}) {
	const [keyword, setKeyword] = useState<string>("");
	const [showItemWithId, setShowItemWithId] = useState<string | number | null>(null);

	const adminContext = useContext(AdminContext);
	const items = useQuery(["items_" + id.toString()], () => getItems(adminContext.admin?.token, id));

	const data = [];
	if (items.isSuccess) {
		for (let i = 0; i < items.data.data.length; i++) {
			data.push(items.data.data[i].value);
		}
	}

	function showItem(id: number | string) {
		setShowItemWithId(id);
	}

	return (
		<div className="my-4">
			{adminContext.admin && showItemWithId && (
				<ViewItem
					id={showItemWithId}
					token={adminContext.admin?.token}
					setShowItemWithId={setShowItemWithId}
					template={template}
				/>
			)}
			<div className="flex place-items-center">
				<div className="flex gap-1">
					<Button
						elementChildren="Add Item"
						elementState="default"
						elementStyle="black"
						elementType="button"
						elementIcon="add"
						elementInvert={true}
						elementSize="small"
						onClick={() => {
							setShowAddItemBox(true);
						}}
					/>
					<Button
						elementChildren="Export"
						elementState="default"
						elementStyle="no_border_opaque"
						elementType="button"
						elementIcon="export"
						elementInvert={false}
						elementSize="small"
						onClick={() => {
							console.log("x");
						}}
					/>
				</div>
				<div className="flex-1 flex justify-end">
					<div className="relative w-64" title="Filter list">
						<input
							type="text"
							className="pl-9 h-9 bg-gray-100 dark:border-gray-700 dark:text-white w-full rounded-md text-sm focus-visible:bg-white outline-dodger-500 focus-visible:shadow-md"
							placeholder="Filter"
							onChange={(e) => {
								setKeyword(e.target.value);
							}}
							value={keyword}
						/>
						<svg
							viewBox="0 0 24 24"
							className="w-4 absolute text-gray-400 top-1/2 transform translate-x-0.5 -translate-y-1/2 left-2"
							stroke="currentColor"
							strokeWidth={2}
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						</svg>
					</div>
				</div>
			</div>
			<div className="my-4">
				{items.isSuccess && items.data && template && (
					<Table
						columns={["name", ...template.map((obj) => obj.n.replaceAll(" ","_") + "_c")]}
						rows={items.data.data}
						elementShowSelectMultiple={true}
						showItem={showItem}
					/>
				)}
			</div>
		</div>
	);
}
