import {useState} from "react";
import AddNewItemField from "./AddNewItemField";
import InputField from "@/components/custom-ui/InputField";
import {useForm} from "react-hook-form";
import {AxiosError} from "axios";
import InputButton from "@/components/custom-ui/InputButton";
import {editItemType} from "@/services/item/item_type/edit_item_type";
import {deleteItemType} from "@/services/item/item_type/delete_item_type";
import {handleAxiosError} from "@/components/utils/HandleAxiosError";
import {deleteItemTypeFields} from "@/services/item/item_type/delete_item_type_field";
import {ItemTypeType} from "@/types/item";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export default function ManageItemType({itemtype}: {itemtype: ItemTypeType}) {
	const queryClient = useQueryClient();
	const {
		register,
		handleSubmit,
		reset,
		formState: {errors},
	} = useForm();

	const [reqError, setReqError] = useState<string | null>(null);
	const editNameDescMutation = useMutation({
		mutationFn: (fields: {name: string; description: string}) => {
			return editItemType(itemtype.id, fields["name"], fields["description"]);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ["item_type_" + itemtype.id]});
			setReqError(null);
			reset();
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setReqError);
		},
	});

	const [deleteCheckbox, setDeleteCheckbox] = useState<boolean>(false);
	const [deleteItemTypeReqError, setDeleteItemTypeReqError] = useState<string | null>(null);
	const deleteItemTypeMutation = useMutation({
		mutationFn: () => {
			return deleteItemType(itemtype.id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ["item_type_" + itemtype.id]});
			queryClient.invalidateQueries({queryKey: ["item_type_list"]});
			setDeleteItemTypeReqError(null);
			reset();
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setDeleteItemTypeReqError);
		},
	});

	const [deleteItemFieldReqError, setDeleteItemFieldReqError] = useState<string | null>(null);
	const deleteItemFieldMutation = useMutation({
		mutationFn: (fields: string) => {
			return deleteItemTypeFields(itemtype.id, fields);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ["item_type_" + itemtype.id]});
			setDeleteItemFieldReqError(null);
			reset();
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setDeleteItemFieldReqError);
		},
	});

	return (
		<div className="max-w-[1400px]">
			{/* edit name and descrition */}
			<div className="grid grid-cols-2 gap-6 mb-6 mt-4 border-b pb-8">
				<div>
					<h3 className="text-md font-medium text-gray-800 my-4">Name and Description</h3>
					<p className="text-bb text-gray-500">
						Make changes to name and description of the item type.
					</p>
					{editNameDescMutation.isError && (
						<p className="text-bb text-red-700 my-4">{reqError || "Unable to reach server."}</p>
					)}
					{editNameDescMutation.isSuccess && (
						<p className="text-bb text-green-700 my-4">Changes have been saved.</p>
					)}
				</div>
				<div className="mt-[2.75rem]">
					<form
						key={itemtype.id}
						onSubmit={handleSubmit((d) => {
							editNameDescMutation.mutate(JSON.parse(JSON.stringify(d)));
						})}
					>
						<fieldset disabled={editNameDescMutation.isPending}>
							<div>
								<InputField
									elementId="name"
									elementInputType="text"
									elementHookFormRegister={register}
									elementLabel="Name"
									elementInputMinLength={2}
									elementInputMaxLength={48}
									elementIsRequired={true}
									elementHookFormErrors={errors}
									defaultValue={itemtype.name}
								/>
								<InputField
									elementId="description"
									elementInputType="text"
									elementIsTextarea={true}
									elementHookFormRegister={register}
									elementLabel="Description"
									elementIsRequired={true}
									elementHookFormErrors={errors}
									defaultValue={itemtype.description}
								/>
							</div>

							<div className="mt-6">
								<InputButton
									elementState={editNameDescMutation.isPending ? "loading" : "default"}
									elementStyle="black"
									elementSize="base"
									elementChildren="Submit"
									elementType="submit"
								/>
							</div>
						</fieldset>
					</form>
				</div>
			</div>

			<h3 className="text-md font-medium text-gray-800 mb-6">Fields</h3>
			<div className="border border-gray-300 rounded-lg pb-2">
				<table className="w-full">
					<thead>
						<tr className="text-left border-b border-gray-300 text-gray-500 uppercase">
							<th className="w-[33%] py-2.5 text-bb font-medium pl-4">Name</th>
							<th className="w-[25%] py-2.5 text-bb font-medium pl-4">Type</th>
							<th className="w-[42%] py-2.5 text-bb font-medium pl-4">Attached Value</th>
						</tr>
					</thead>
					<tbody>
						<tr className="group border-b border-gray-200 bg-gray-100">
							<td className="w-[33%] border-b border-gray-200 py-2 text-bb pl-4">Name</td>
							<td className="w-[25%] border-b border-gray-200 text-gray-600 py-2 text-sm pl-4">
								text
							</td>
							<td className="w-[42%]"></td>
						</tr>
						{itemtype.template && itemtype.template?.length > 0 ? (
							itemtype.template.map((field: {n: string; t: string; dV?: string}) => (
								<tr
									key={field.n}
									className="group border-b border-gray-200 hover:bg-gray-50 bg-white"
								>
									<td className="w-[33%] border-b border-gray-200 py-2 text-bb pl-4">{field.n}</td>
									<td className="w-[25%] border-b border-gray-200 text-gray-600 py-2 text-sm pl-4">
										{field.t}
									</td>
									<td className="relative w-[42%] border-b border-gray-200 text-gray-600 py-2 text-bb pl-4">
										{field.dV}
										<div className="bg-gray-50 absolute right-0 top-0 mt-1.5 flex gap-1.5 mx-2 font-medium">
											{/*<button
												className="px-2 py-1 gap-1.5 place-items-center justify-center opacity-60 hover:opacity-100 focus:opacity-100 focus:outline focus:outline-2 outline-dodger-600 rounded hidden group-hover:flex text-gray-900"
												title="Rename field"
											>
												<span className="ic ic-edit"></span>
												<span>Rename</span>
											</button>*/}
											<button
												className="px-2 p-1 gap-1.5 place-items-center justify-center opacity-80 hover:outline-red-400 hover:outline-1 hover:outline hover:opacity-100 focus:opacity-100 focus:outline focus:outline-2 outline-red-600 rounded hidden group-hover:flex text-red-600"
												title="Delete field"
												onClick={() => {
													deleteItemFieldMutation.mutate(JSON.stringify(field));
												}}
											>
												<span className="ic ic-delete ic-red"></span>
												<span>Remove</span>
											</button>
											{deleteItemFieldReqError && (
												<div className="fixed z-10 inset-0 bg-black/10 flex place-items-center justify-center">
													<div className="bg-white p-6 rounded-lg shadow leading-6 min-w-[300px]">
														<h1 className="text-lg font-bold mb-4">Could not delete the field</h1>
														<p className="">{deleteItemFieldReqError}</p>
														<br />
														<InputButton
															elementType="button"
															elementState="default"
															elementStyle="black"
															elementChildren="Okay"
															onClick={() => {
																setDeleteItemFieldReqError(null);
															}}
														/>
													</div>
												</div>
											)}
										</div>
									</td>
								</tr>
							))
						) : !itemtype.template || itemtype.template?.length < 1 ? (
							<tr>
								<td
									colSpan={3}
									className="text-center bg-white border-b border-gray-200 py-2 text-gray-600 text-bb"
								>
									No fields available.
								</td>
							</tr>
						) : (
							<></>
						)}
					</tbody>
				</table>
			</div>
			<AddNewItemField id={itemtype.id} />
			{/* ### delete ### */}
			<div className="border-t grid grid-cols-2 gap-6 mt-8 pb-8 pt-2">
				<div>
					<h3 className="text-md font-medium text-gray-800 my-4">Delete</h3>
					<p className="text-bb text-gray-500">
						This action cannot be undone. It will also delete all the items within this item type.
						Are you sure you want to delete this item type?
					</p>
					{deleteItemTypeMutation.isError && (
						<p className="text-bb text-red-700 my-4">
							{deleteItemTypeReqError || "Unable to reach server."}
						</p>
					)}
				</div>
				<div className="mt-14">
					<p className="text-gray-700 text-bb mb-4 flex gap-2">
						<input
							type="checkbox"
							id="continue-delete"
							onChange={(e) => {
								setDeleteCheckbox(e.target.checked);
							}}
						/>
						<label htmlFor="continue-delete">Yes, I am sure.</label>
					</p>
					<InputButton
						elementState={
							deleteItemTypeMutation.isPending
								? "loading"
								: deleteItemTypeMutation.isSuccess
								? "done"
								: "default"
						}
						elementStyle="danger"
						elementSize="base"
						elementInvert={true}
						elementType="button"
						elementChildren="DELETE"
						onClick={() => {
							deleteItemTypeMutation.mutate();
						}}
						elementDisabled={deleteItemTypeMutation.isPending || !deleteCheckbox}
					/>
				</div>
			</div>
		</div>
	);
}
