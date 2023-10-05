import { AdminContext } from "@/components/Home";
import { getItemType } from "@/services/item/item_type/get_item_type";
import { ItemTypeType } from "@/types/item";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import EditItemType from "./edit_item_type/EditItemType";
import ViewItems from "./ViewItems";
import AddNewItem from "./AddNewItem";

export default function ItemsListDetailPanel({ id }: { id: number | string }) {
	const adminContext = useContext(AdminContext);
	const [activeTab, setActiveTab] = useState<"list" | "edit">("list");
  const [showAddItemBox, setShowAddItemBox] = useState<boolean>(false);
	const itemTypeQuery = useQuery(["item_type_" + id], () =>
		getItemType(adminContext.admin?.token, id)
	);
	const itemtype: ItemTypeType | null = itemTypeQuery.isSuccess
		? itemTypeQuery.data.data
		: null;

	return (
		<div className="min-h-[100%]">
			<div className="border-b sticky top-0 bg-white z-[5]">
				<div className="flex gap-6 px-8 py-6">
					<div className="h-16 w-16 bg-gray-200 rounded-full flex place-items-center justify-center capitalize text-4xl text-gray-400">
						{itemtype?.name[0]}
					</div>
					<div>
						<h1 className="text-3xl tracking-tight">{itemtype?.name} </h1>
						<div className="text-gray-600 mt-0.5">
							{itemtype?.description}
						</div>
					</div>
				</div>
				<div className="text-bb px-8 flex gap-6">
					<button
						onClick={() => {
							setActiveTab("list");
						}}
						className={
							(activeTab === "list"
								? "text-dodger-700 border-dodger-600"
								: "text-gray-600 border-transparent") +
							" border-b-2 p-2 active:bg-dodger-50"
						}
					>
						Item List
					</button>
					<button
						onClick={() => {
							setActiveTab("edit");
						}}
						className={
							(activeTab === "edit"
								? "text-dodger-700 border-dodger-600"
								: "text-gray-600 border-transparent") +
							" border-b-2 p-2 active:bg-dodger-50"
						}
					>
						Manage
					</button>
				</div>
			</div>
			<div className="mx-8 max-w-[1400px]">        
				{activeTab === "edit" && <EditItemType id={id} />}
				{activeTab === "list" && (
          <>
            {itemtype && showAddItemBox && <AddNewItem setShowAddItemBox={setShowAddItemBox} itemType={itemtype}/>}
					  <ViewItems id={id} template={itemtype?.template || null} setShowAddItemBox={setShowAddItemBox}/>
				  </>
        )}
			</div>
		</div>
	);
}
