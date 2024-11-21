import {useState} from "react";
import {useParams} from "react-router-dom";
import {ItemTypeType} from "@/types/item";
import {useQuery} from "react-query";
import {getItemType} from "@/services/item/item_type/get_item_type";
import Button from "@/components/ui/Button";
import ItemTypeList from "@/components/dashboard/database-items/List";
import ItemTypeDetailPanel from "@/components/dashboard/database-items/DetailPanel";
import AddNewItemType from "@/components/dashboard/database-items/AddNew";
import QuickLinkBar from "@/components/dashboard/QuickLinkBar";
import Sidebar from "@/components/dashboard/Sidebar";

export default function ItemsPage() {
	const {id} = useParams();
	const [activeItem, setActiveItem] = useState<ItemTypeType>();
	const [showAddItemTypeUI, setShowAddItemTypeUI] = useState<boolean>(false);

	useQuery(
		["item_type_" + id],
		() => (id ? getItemType(id) : Promise.reject("No value is selected.")),
		{
			enabled: !!id,
			onSuccess: (data) => setActiveItem(data.data),
			onError: () => setActiveItem(undefined),
		},
	);

	return (
		<div className="flex h-screen overflow-hidden">
			<div className="px-3 border-r h-screen bg-white">
				<Sidebar activeMenu={"items"} />
			</div>
			<div className="flex-1 h-full overflow-hidden flex flex-col">
				{/* main content starts */}
				<QuickLinkBar />
				<div className="flex flex-grow overflow-x-hidden">
					<div className="w-64 p-4 flex-shrink-0 border-r overflow-y-auto h-full bg-gray-100">
						<div className="flex place-items-center mb-4">
							<div className="capitalize text-sm mt-2 mb-1 text-gray-800 font-thin tracking-wider flex-1">
								DATABASE ITEM TYPES
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
										window.setTimeout(() => document?.getElementById("name")?.focus(), 0);
									}}
									aria-expanded={showAddItemTypeUI}
								/>
							</div>
						</div>
						<ItemTypeList activeItem={activeItem} />
					</div>
					<div className="overflow-y-auto bg-white w-full">
						{activeItem?.id && <ItemTypeDetailPanel key={activeItem.id} itemtype={activeItem} />}
					</div>
				</div>
				<div aria-hidden={!showAddItemTypeUI} className="aria-hidable absolute inset-0">
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
			</div>
			{/* main content end */}
		</div>
	);
}
