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
										<td className="relative w-full border-b border-gray-200 py-2 text-sm pl-4 text-gray-600">
											{field.t}
                      <div className="absolute right-0 top-0 mt-1.5 flex gap-1.5 mx-2">
                        <button className="px-2 py-1 flex gap-1.5 place-items-center justify-center opacity-50 hover:opacity-80 focus:opacity-80 focus:outline focus:outline-2 outline-dodger-600 rounded hidden group-hover:flex text-gray-700" title="Rename field">
                          <span className="ic ic-edit"></span><span>Rename</span>
                        </button>
                        <button className="px-2 p-1 flex gap-1.5 place-items-center justify-center opacity-50 hover:opacity-80 focus:opacity-80 focus:outline focus:outline-2 outline-dodger-600 rounded hidden group-hover:flex text-gray-700 hover:text-red-600" title="Delete field">
                          <span className="ic ic-delete"></span><span>Remove</span>
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
