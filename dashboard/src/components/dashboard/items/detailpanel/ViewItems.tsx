import { AdminContext } from "@/components/Home";
import { getItems } from "@/services/item/get_items";
import { useContext, useState } from "react";
import { useQuery } from "react-query";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

export default function ViewItems({id, template} : {id: number | string, template: {"n": string, "t": string}[] | null}) {
  const [keyword, setKeyword] = useState<string>("");
  let columns = [];
  const columnHelper = createColumnHelper()
  if (template) {
    for (let i = 0; i < template.length; i++) {
      columns.push(columnHelper.accessor(template[i].n, {
        header: template[i].n
      }))
    }
  }

	const adminContext = useContext(AdminContext);
	const items = useQuery(["items_" + id.toString()], () =>
		getItems(adminContext.admin?.token, id)
	);

  let data = []
  if (items.isSuccess) {
    for (let i = 0; i < items.data.data.length; i++) {
      data.push(items.data.data[i].value);
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="my-4">
      <div className="flex place-items-center">
      <button
				onClick={() => {
						console.log("add");
				}}
				className="flex place-items-center gap-1.5 text-gray-700 font-normal py-1.5 px-2 hover:bg-gray-100 focus:outline outline-2 rounded outline-dodger-500 text-bb"
			>
				<span className="ic ic-add ic-black"></span>
				<span>Add item</span>
			</button>
        <div className="flex-1 flex justify-end">
          <div
					className="relative w-64"
					title="Filter list"
				>
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
    <table className="w-full">
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr className="text-left border-b border-gray-300 text-gray-500 uppercase" key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th className="w-1/3 py-2.5 text-bb font-medium px-3" key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                 )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
          {items.isSuccess && table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  <span className="truncate">{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
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
