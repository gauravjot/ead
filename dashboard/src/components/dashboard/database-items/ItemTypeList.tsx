import { AdminContext } from "@/components/Home";
import Spinner from "@/components/ui/Spinner";
import { getAllItemTypes } from "@/services/item/item_type/get_all_item_types";
import { ErrorType } from "@/types/api";
import { ItemTypeType } from "@/types/item";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useQuery } from "react-query";

export default function ItemTypeList({
	activeItem,
	setActiveItem,
}: {
	activeItem: ItemTypeType | undefined;
	setActiveItem: Dispatch<SetStateAction<ItemTypeType | undefined>>;
}) {
	const [keyword, setKeyword] = useState<string>("");
	const adminContext = useContext(AdminContext);
	const item_types = useQuery(["item_type_list"], () =>
		getAllItemTypes(adminContext.admin?.token)
	);

	if (item_types.isSuccess) {
		// Remove active item if item does not exist.
		if (!item_types.data.data.includes(activeItem)) {
			setActiveItem(undefined);
		}
	}

	return (
		<>
			<div className="flex">
				<div
					className="relative flex-1"
					title="Filter with name, email and title"
				>
					<input
						type="text"
						className="pl-8 h-9 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-white w-full rounded-md text-sm focus-visible:bg-white"
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
				<div className="ml-2 flex place-items-center">
					<button
						title="Refresh"
						onClick={() => {
							item_types.refetch();
						}}
						className="h-9 w-9 hover:bg-gray-300 rounded flex place-items-center justify-center"
					>
						{item_types.isFetching ? (
							<Spinner size="sm" color="black" />
						) : (
							<span className="ic ic-sync"></span>
						)}
					</button>
				</div>
			</div>
			<div className="flex flex-col gap-3 my-4">
				{item_types.isSuccess ? (
					item_types.data.data.map((item: ItemTypeType) => {
						return (
							item.name.toLowerCase().includes(keyword.toLowerCase()) && (
								<button
									key={item.id + item.name}
									className={
										"text-left bg-white rounded-md py-2.5 px-4 focus:outline hover:outline hover:outline-2 focus:outline-dodger-600 hover:outline-dodger-700 focus:outline-2" +
										(activeItem && activeItem.id === item.id
											? " outline outline-[2.5px] outline-dodger-600 hover:outline-dodger-500 shadow-md"
											: " shadow")
									}
									onClick={() => {
										setActiveItem(item);
									}}
								>
									<div
										title={item.name}
										className="text-bb font-medium"
									>
										{item.name}
									</div>
									<div
										title={item.description}
										className="mt-1 text-sm text-gray-600 truncate"
									>
										{item.description}
									</div>
								</button>
							)
						);
					})
				) : item_types.isLoading ? (
					<div className="text-center py-24">
						<Spinner color="gray" size="md" />
					</div>
				) : item_types.isError ? (
					<div>{(item_types.error as ErrorType).message}</div>
				) : (
					<></>
				)}
			</div>
		</>
	);
}
