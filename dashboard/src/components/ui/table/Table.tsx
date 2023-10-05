import Button from "../Button";
import TableOptions from "./Options";

export default function Table({columns, rows} : {columns: string[], rows: {}[]}) {
  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="border-b border-gray-300">
          
          <THeader columns={columns}/>
          <TableOptions columns={columns} />
        </tr>
      </thead>
      <tbody>
        <TCell columns={columns} rows={rows} />
      </tbody>
    </table>
  )
}

function THeader({columns} : {columns: string[]}) {
  return columns.map((col) => {
    return <td key={col} className="text-gray-600 font-medium text-bb uppercase px-2 py-2">{col.replaceAll("_c","")}</td>;
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
          <td>
            <div className="hidden group-hover:flex place-items-center justify-end gap-2 px-2">
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
          </td>
        </tr>
      );
    })}
  </>;
}
