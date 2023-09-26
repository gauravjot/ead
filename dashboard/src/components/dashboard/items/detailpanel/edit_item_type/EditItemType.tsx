import { AdminContext } from "@/components/Home";
import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getItemType } from "@/services/item/get_item_type";
import AddNewField from "./AddNewField";
import Spinner from "@/components/ui/Spinner";
import InputField from "@/components/ui/InputField";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { ErrorType } from "@/types/api";
import Button from "@/components/ui/Button";
import { editItemType } from "@/services/item/edit_item_type";

export default function EditItemType({ id }: { id: number | string }) {
	const adminContext = useContext(AdminContext);
	const itemTypeQuery = useQuery(["item_type_" + id], () =>
		getItemType(adminContext.admin?.token, id)
	);
	const queryClient = useQueryClient();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const [reqError, setReqError] = useState<string | null>(null);
	const editNameDescMutation = useMutation({
		mutationFn: (fields: { name: string; description: string }) => {
			return adminContext.admin
				? editItemType(
						adminContext.admin?.token,
						id,
						fields["name"],
						fields["description"]
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  )
				: Promise.reject();
		},
		onSuccess: () => {
			queryClient.resetQueries(["item_type_" + id, "item_type_list"]);
			setReqError(null);
			reset();
		},
		onError: (error: AxiosError) => {
			if (error.response) {
				const res = error.response.data as ErrorType;
				setReqError(res.message);
			}
		},
	});

	return itemTypeQuery.isSuccess ? (
		<>
			{/* edit name and descrition */}
			<div className="grid grid-cols-2 gap-6 mb-8 mt-4 border-b pb-8">
				<div>
					<h3 className="text-md font-medium text-gray-800 my-4">
						Name and Description
					</h3>
					<p className="text-bb text-gray-500">
						Make changes to name and description of the item type.
					</p>
					{editNameDescMutation.isError && (
						<p className="text-bb text-red-700 my-4">
							{reqError || "Unable to reach server."}
						</p>
					)}
					{editNameDescMutation.isSuccess && (
						<p className="text-bb text-green-700 my-4">
							Changes have been saved.
						</p>
					)}
				</div>
				<div className="mt-[2.75rem]">
					<form
						key={id}
						onSubmit={handleSubmit((d) => {
							editNameDescMutation.mutate(JSON.parse(JSON.stringify(d)));
						})}
					>
						<fieldset disabled={editNameDescMutation.isLoading}>
							<div>
								<InputField
									id="name"
									inputType="text"
									register={register}
									label="Name"
									minLength={2}
									maxLength={48}
									isRequired={true}
									errors={errors}
									defaultValue={itemTypeQuery.data.data.name}
								/>
								<InputField
									id="description"
									inputType="text"
									isTextarea={true}
									register={register}
									label="Description"
									isRequired={true}
									errors={errors}
									defaultValue={itemTypeQuery.data.data.description}
								/>
							</div>

							<div className="mt-6">
								<Button
									state={
										editNameDescMutation.isLoading
											? "loading"
											: "default"
									}
									styleType="black"
									size="base"
									children="Submit"
									type="submit"
								/>
							</div>
						</fieldset>
					</form>
				</div>
			</div>

			<h3 className="text-md font-medium text-gray-800 mb-6">Fields</h3>
			<div className="border border-gray-300 rounded-lg pb-2 bg-gray-100">
				<table className="w-full">
					<thead>
						<tr className="text-left border-b border-gray-200 text-gray-500">
							<th className="w-1/3 py-2.5 text-bb font-normal pl-4">
								Name
							</th>
							<th className="w-full py-2.5 text-bb font-normal pl-4">
								Type
							</th>
						</tr>
					</thead>
					<tbody>
						{itemTypeQuery.isSuccess &&
							itemTypeQuery.data.data.template &&
							itemTypeQuery.data.data.template.map(
								(field: { n: string; t: string }) => (
									<tr
										key={field.n}
										className="group border-b border-gray-200 hover:bg-gray-50 bg-white"
									>
										<td className="w-1/3 border-b border-gray-200 py-2 text-bb pl-4">
											{field.n}
										</td>
										<td className="relative w-full border-b border-gray-200 text-gray-600 py-2 text-sm pl-4">
											{field.t}
											<div className="absolute right-0 top-0 mt-1.5 flex gap-1.5 mx-2 font-medium">
												<button
													className="px-2 py-1 gap-1.5 place-items-center justify-center opacity-60 hover:opacity-100 focus:opacity-100 focus:outline focus:outline-2 outline-dodger-600 rounded hidden group-hover:flex text-gray-900"
													title="Rename field"
												>
													<span className="ic ic-edit"></span>
													<span>Rename</span>
												</button>
												<button
													className="px-2 p-1 gap-1.5 place-items-center justify-center opacity-60 hover:opacity-100 focus:opacity-100 focus:outline focus:outline-2 outline-red-600 rounded hidden group-hover:flex text-red-600"
													title="Delete field"
												>
													<span className="ic ic-delete ic-red"></span>
													<span>Remove</span>
												</button>
											</div>
										</td>
									</tr>
								)
							)}
					</tbody>
				</table>
			</div>
			<AddNewField id={id} />
		</>
	) : itemTypeQuery.isLoading ? (
		<div className="my-24 flex place-items-center justify-center">
			<Spinner color="gray" size="xl" />
		</div>
	) : (
		<></>
	);
}
