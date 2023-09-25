import { AdminContext } from "@/components/Home";
import { useContext } from "react";
import { useQuery } from "react-query";
import { getItemType } from "@/services/item/get_item_type";
import AddNewField from "./edit_item_type/AddNewField";
import Spinner from "@/components/ui/Spinner";

export default function EditItemType({ id }: { id: number | string }) {
	const adminContext = useContext(AdminContext);
	const itemTypeQuery = useQuery(["item_type_" + id], () =>
		getItemType(adminContext.admin?.token, id)
	);

	return itemTypeQuery.isSuccess ? (
		<>
			<h3 className="text-md font-medium text-gray-800 my-4">Fields</h3>
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
							itemTypeQuery.data.data.template.map(
								(field: { n: string; t: string }) => (
									<tr
										key={field.n}
										className="border-b border-gray-200 hover:bg-gray-100 bg-white"
									>
										<td className="w-1/3 py-2 text-bb pl-4">
											{field.n}
										</td>
										<td className="w-full py-2 text-sm pl-4 text-gray-600">
											{field.t}
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
