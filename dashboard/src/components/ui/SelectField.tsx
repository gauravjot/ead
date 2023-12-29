import { FieldValues, UseFormRegister } from "react-hook-form";


export default function SelectField({label, id, hookFormRegister, data, elementWidth="auto"}: {
	label: string,
	id: string,
	data: {n: string, v: string}[],
	hookFormRegister: UseFormRegister<FieldValues>,
    elementWidth?: "full" | "auto";
}) {
	return <>
	<div className="mt-3 pb-1.5 text-sm text-gray-600">
		{label}{" "}
		<span className="text-red-500 font-bold" title="Required">
			*
		</span>
	</div>
	<select 
		className={"w-full bg-white border-gray-300 border rounded-md px-4 py-2" + (elementWidth === "auto" ? " max-w-[20rem]": "")}
		{...hookFormRegister(id, {required: true})}>
		<option value=""></option>
		{data.map((d)=> {
			return <option key={d.v} value={d.v}>{d.n}</option>
		})}
	</select>
</>
}