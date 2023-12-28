import { useState } from "react";
import Button from "@/components/ui/Button";
import { ItemTypeType } from "@/types/item";
import AddNewItemType from "@/components/dashboard/items/AddNewItemType";
import ItemTypeList from "./ItemTypeList";
import DetailPanel from "./detailpanel/DetailPanel";

export default function Items() {
	const [activeItem, setActiveItem] = useState<ItemTypeType>();
	const [showAddItemTypeUI, setShowAddItemTypeUI] = useState<boolean>(false);

	return (
		<>
			<div className="flex flex-grow overflow-x-hidden">
				<div className="w-64 p-4 flex-shrink-0 border-r overflow-y-auto h-full">
					<div className="flex place-items-center mb-4">
						<div className="capitalize text-sm mt-2 mb-1 text-gray-800 font-thin tracking-wider flex-1">
							ITEM TYPES
						</div>
						<div>
							<Button
								elementState="default"
								elementStyle="primary"
								elementType="button"
								elementChildren="Add"
								elementSize="xsmall"
								elementInvert={true}
								onClick={() => {
									setShowAddItemTypeUI(true);
									window.setTimeout(
										() => document?.getElementById("name")?.focus(),
										0
									);
								}}
								aria-expanded={showAddItemTypeUI}
							/>
						</div>
					</div>
					<ItemTypeList activeItem={activeItem} setActiveItem={setActiveItem} />
				</div>
				<div className="overflow-y-auto bg-white w-full">
					{activeItem?.id && (
						<DetailPanel key={activeItem.id} id={activeItem.id} />
					)}
				</div>
			</div>
			<div
				aria-hidden={!showAddItemTypeUI}
				className="aria-hidable absolute inset-0"
			>
				{/* clicking empty space closes the box */}
				<div
					className="absolute inset-0 bg-black/10 z-10"
					onClick={() => {
						setShowAddItemTypeUI(false);
					}}
				></div>
				{/* dialog box content */}
				<div className="bg-white shadow-xl px-4 py-6 sm:px-8 sm:py-12 relative z-20">
					<div className="flex container mx-auto">
						<h1 className="text-2xl flex-1 font-bold tracking-tight mb-3 xl:min-w-[45rem]">
							Add new item type
						</h1>
						<div>
							<button
								className="ic-xl pt-1 border rounded-md hover:outline hover:outline-gray-200 hover:border-gray-400"
								onClick={() => {
									setShowAddItemTypeUI(false);
								}}
								title="Close"
							>
								<span className="ic ic-close"></span>
							</button>
						</div>
					</div>
					<div className="container mx-auto">
						<AddNewItemType setShowDialog={setShowAddItemTypeUI} />
					</div>
				</div>
			</div>
		</>
	);
}
