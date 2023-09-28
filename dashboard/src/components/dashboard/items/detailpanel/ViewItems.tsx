import { AdminContext } from "@/components/Home";
import { getItems } from "@/services/item/get_items";
import { ItemType } from "@/types/item";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useQuery } from "react-query";

export default function ViewItems({
	id,
	template,
  setShowAddItemBox
}: {
	id: number | string;
	template: { n: string; t: string }[] | null;
  setShowAddItemBox: Dispatch<SetStateAction<boolean>>;
}) {
	const [keyword, setKeyword] = useState<string>("");

	const adminContext = useContext(AdminContext);
	const items = useQuery(["items_" + id.toString()], () =>
		getItems(adminContext.admin?.token, id)
	);

	const data = [];
	if (items.isSuccess) {
		for (let i = 0; i < items.data.data.length; i++) {
			data.push(items.data.data[i].value);
		}
	}

	return (
		<div className="my-4">
			<div className="flex place-items-center">
				<button
					onClick={() => {
						setShowAddItemBox(true);
					}}
					className="flex place-items-center gap-1.5 text-gray-700 font-normal py-1.5 px-2 hover:bg-gray-100 focus:outline outline-2 rounded outline-dodger-500 text-bb"
				>
					<span className="ic ic-add ic-black"></span>
					<span>Add item</span>
				</button>
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
			<div className="border border-gray-300 rounded-lg pb-2 my-3">
				<table className="w-full table-fixed">
					<thead>
							<tr
								className="text-left border-b border-gray-300 text-gray-500 uppercase"
							>
                <th
									className="w-1/3 py-2.5 text-bb font-medium px-3 border-r"
								>
                  Name
								</th> 
                <th
									className="w-1/3 py-2.5 text-bb font-medium px-3 border-r"
								>
                  Description
								</th> 
                <th
									className="w-1/3 py-2.5 text-bb font-medium px-3 border-r"
								>
                  Active
								</th> 
								{template?.map((header) => (
									<th
                  className="w-1/3 py-2.5 text-bb font-medium px-3 border-r last:border-0"
										key={header.n}
									>
                  {header.n}
									</th>
								))}
							</tr>
					</thead>
					<tbody>
						{items.isSuccess && items.data.data.length > 0 &&
              items.data.data.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-100">
                  <td className="w-1/3 py-2.5 text-bb font-medium px-3 border-r truncate" title={row.name}>
										<span>
                      {row.name} 
										</span>
									</td>
                  <td className="w-1/3 py-2.5 text-bb font-medium px-3 border-r truncate" title={row.description}>
										<span>
                      {row.description}
										</span>
									</td>
                  <td className="w-1/3 py-2.5 text-bb font-medium px-3 border-r truncate">
										<span>
                      {row.active ? "Y" : "N"}
										</span>
									</td>
                  {template?.map((cell) => (
                    <td key={cell["n"]} className="w-1/3 py-2.5 text-bb font-medium px-3 border-r last:border-0 truncate" title={row[cell["n"]+"_c"]}>
											<span>
                        {row[cell["n"]+"_c"]}
											</span>
										</td>
									))}
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
