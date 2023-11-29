import {AdminContext} from "@/components/Home";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import Spinner from "@/components/ui/Spinner";
import Table from "@/components/ui/table/Table";
import {getItem} from "@/services/item/get_item";
import {getItems} from "@/services/item/get_items";
import {ItemFieldValueType} from "@/types/item";
import {Dispatch, SetStateAction, useContext, useState} from "react";
import {useForm} from "react-hook-form";
import {useQuery} from "react-query";

export default function ViewItems({
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
				<ShowItem
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
						elementStyle="no_border_opaque"
						elementType="button"
						elementIcon="add"
						elementInvert={false}
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
						columns={["name", "description", "active", ...template.map((obj) => obj.n + "_c")]}
						rows={items.data.data}
						elementShowSelectMultiple={true}
						showItem={showItem}
					/>
				)}
			</div>
		</div>
	);
}

function ShowItem({
	token,
	id,
	setShowItemWithId,
	template,
}: {
	token: string;
	id: number | string;
	setShowItemWithId: Dispatch<SetStateAction<string | number | null>>;
	template: {n: string; t: string}[] | null;
}) {
	const item_query = useQuery(["item_info_" + id.toString()], () => getItem(token, id));
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm();
	const [isReadOnly, setIsReadOnly] = useState<boolean>(true);

	return (
		<div className="fixed inset-0 z-10">
			<div className="absolute bg-black/10 inset-0"></div>
			<div className="overflow-y-auto max-h-screen min-h-[500px] shadow bg-white px-6 py-10 relative z-10">
				<div className="container mx-auto">
					<div className="flex">
						<h1 className="text-2xl flex-1 font-bold tracking-tight">Item Details</h1>
						<Button
							elementType="button"
							elementState="default"
							elementStyle="border_opaque"
							elementIcon="close"
							elementChildren=""
							elementSize="small"
							onClick={() => {
								setShowItemWithId(null);
							}}
						/>
					</div>
					{item_query.isLoading ? (
						<div className="flex justify-center my-24">
							<Spinner size="lg" color="accent" />
						</div>
					) : item_query.isError ? (
						<div className="text-lg flex place-items-center justify-center my-12 text-gray-600 flex-col gap-2">
							<span className="ic-xl ic-close ic-gray-25"></span>
							<span>Unable to fetch item data.</span>
						</div>
					) : item_query.isSuccess && item_query.data ? (
						<div className="grid grid-cols-2 pt-8 gap-24 xl:gap-48">
							<form
								className="col-span-1"
								onSubmit={handleSubmit((d) => {
									console.log(d);
								})}
							>
								<div className="">
									<h2 className="font-medium mb-3">General Information</h2>
									<InputField
										elementId="name"
										elementLabel="Name"
										elementInputType="text"
										elementWidth="full"
										elementIsReadOnly={isReadOnly}
										elementHookFormRegister={register}
										elementHookFormErrors={errors}
										defaultValue={item_query.data.data.name}
									/>
									<InputField
										elementId="description"
										elementLabel="Description"
										elementInputType="text"
										elementWidth="full"
										elementHookFormRegister={register}
										elementIsReadOnly={isReadOnly}
										elementIsTextarea={true}
										elementHookFormErrors={errors}
										defaultValue={item_query.data.data.description}
									/>
								</div>
								<div className="mt-10">
									<h2 className="font-medium mb-3">Specific Information</h2>
									{template?.map((obj) => {
										const val = item_query.data.data.value.filter(
											(row: {n: string; v: string}) => row.n === obj.n
										);
										return obj.t !== "boolean" ? (
											<InputField
												key={obj.n + "_c"}
												elementId={obj.n + "_c"}
												elementLabel={obj.n}
												elementWidth="full"
												elementIsReadOnly={isReadOnly}
												elementInputType={obj.t as ItemFieldValueType}
												elementHookFormRegister={register}
												elementHookFormErrors={errors}
												defaultValue={val.length > 0 ? val[0].v : ""}
											/>
										) : (
											<span key={obj.n + "_c"}>Boolean field</span>
										);
									})}
								</div>
								<div className="mt-10">
									{!isReadOnly && (
										<Button
											elementState="default"
											elementChildren="Apply Changes"
											elementType="submit"
											elementStyle="black"
										/>
									)}
								</div>
								<div className="flex gap-2 mt-6 text-gray-500">
									<input
										type="checkbox"
										id="enable-edit"
										onChange={(e) => {
											setIsReadOnly(!e.currentTarget.checked);
										}}
									/>
									<label htmlFor="enable-edit">Enable editing</label>
								</div>
							</form>
							{/* allocation current */}
							<div className="col-span-1">
								<h2 className="font-medium mb-4">Allocation</h2>
								<div className="">Peter Parker</div>
								<div className="text-gray-600 text-md">Supervisor</div>
								<div className="flex gap-6 text-gray-600 text-md mb-4">
									<span>Email: abc@example.com</span>
									<span>Phone: +1 (603)-123-4567</span>
								</div>
								<div className="font-medium text-bb mb-1">Done by</div>
								<div className="text-gray-600 text-md">Admino Namegen</div>
								<div className="flex gap-6 text-gray-600 text-md mb-4">May 12, 2023</div>
								<Button
									elementChildren="Move allocation"
									elementStyle="primary"
									elementInvert={true}
									elementState="default"
									elementType="button"
									elementSize="small"
								/>
								{/* allocation history */}
								{/* accordion list */}
								<h2 className="font-medium mt-10 mb-4">History</h2>
								<div className="pb-2 pt-3 px-4 border-b bg-gray-100">
									<div className="font-medium leading-5">
										Peter Parker{" - "}
										<span className="text-gray-600 text-sm leading-5">Supervisor</span>
									</div>

									<div className="text-sm text-gray-600 leading-5">
										July 15, 2021 to February 12, 2023
									</div>
								</div>
							</div>
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
}
