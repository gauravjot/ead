import { Dispatch, SetStateAction, useState } from "react";
import Button from "../Button";
import TableOptions from "./Options";

export default function Table({columns, rows} : {columns: string[], rows: {}[]}) {
  const [sortColumn, setSortColumn] = useState<string|null>(null);
  const [sortOrder, setSortOrder] = useState<"ascending" | "descending">("ascending");

  return (
    <div className="overflow-y-auto w-full relative">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-300">
          
          <THeader
            columns={columns}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            sortColumn={sortColumn}
            setSortColumn={setSortColumn}
          />
          <TableOptions columns={columns} />
        </tr>
      </thead>
      <tbody>
        <TCell columns={columns} rows={rows} />
      </tbody>
    </table>
    </div>
  )
}

function THeader({columns, sortOrder, setSortOrder, sortColumn, setSortColumn} : {columns: string[], sortOrder: "ascending" | "descending", setSortOrder: Dispatch<SetStateAction<"ascending" | "descending">>, sortColumn: string | null, setSortColumn: Dispatch<SetStateAction<string | null>>}) {

  return columns.map((col) => {
    return (<td 
      key={col} 
      className="select-none min-w-[10rem] font-medium text-bb uppercase px-2 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => {
        if (sortColumn === col) {
          // just change sort sortOrder
          setSortOrder((val) => (val === "ascending") ? "descending" : "ascending");
        } else {
          setSortColumn(col);
          setSortOrder("ascending");
        } 
      }}>
        <div className="flex place-items-center gap-1">
          {sortColumn === col && <div className={"block ic " + (sortOrder === "ascending" ? "ic-up-arrow rotate-180" : "ic-up-arrow")}></div>}
          <span className={sortColumn === col ? "text-gray-600 font-bold" : "text-gray-500"}>
            {col.replaceAll("_c","")}
          </span>
        </div>
    </td>);
  })
}

const cellStyle = "py-2 px-2 text-sm truncate first:font-medium" +
  " text-gray-700 first:underline first:underline-offset-2" +
  " first:hover:cursor-pointer";

function TCell({columns, rows} : {columns: string[], rows: {[key: string]: string | boolean | number;}[]}) {
  return <>
    {rows.map((row) => {
      return (
        <tr className="group w-full border-b last:border-b-0 hover:bg-gray-100">
          {columns.map((col) => {
            return typeof(row[col]) === "boolean" ? 
              <td className="text-center px-2">
                {row[col] ?
                  <div className="bg-dodger-600 rounded-full w-3 h-3 flex place-items-center justify-center">
                    <span className="ic-sm ic-white ic-done"></span>
                  </div>
                  : <div className="bg-gray-400 rounded-full w-3 h-3 flex place-items-center justify-center">
                    <span className="ic-sm ic-white ic-close"></span>
                  </div>}
              </td> 
              : <td className={cellStyle} title={row[col]?.toString()}>
                {row[col]}
              </td>
          })}
          <td className="absolute right-0">
            <div className="hidden group-hover:block">
              <div className="flex place-items-center gap-2 bg-gradient-to-r from-gray-100/50 via-gray-100 to-gray-100 px-2">               
              <Button
                state="default"
                size="xsmall"
                styleType="no_border_opaque"
                outline={true}
                type="button"
                children={<></>}
                icon="edit"
              />
              <Button
                state="default"
                size="xsmall"
                styleType="no_border_opaque"
                outline={true}
                type="button"
                children={<></>}
                icon="delete"
              />
              </div>
            </div>
          </td>
        </tr>
      );
    })}
  </>;
}
