import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import {handleAxiosError} from "@/components/utils/HandleAxiosError";
import {addItemTypeFields} from "@/services/item/item_type/add_item_type_field";
import {getAllItemTypes} from "@/services/item/item_type/get_all_item_types";
import {ItemTypeType} from "@/types/item";
import {AxiosError} from "axios";
import {useEffect, useState} from "react";
import {FieldValues, UseFormRegister, useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";
import {FIELDS} from "./ItemFieldTypes";

export default function AddNewItemField({id}: {id: number | string}) {
	const queryClient = useQueryClient();
	const [showNewField, setShowNewField] = useState<boolean>(false);
	const [extraData, setExtraDate] = useState<{type: string; name: string} | null>(null);
	const {
		register,
		handleSubmit,
		reset,
		formState: {errors},
		clearErrors,
	} = useForm();

	const [reqError, setReqError] = useState<string | null>(null);
	const mutation = useMutation({
		mutationFn: (fields: string) => {
			return addItemTypeFields(id, fields);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["item_type_" + id]);
			setReqError(null);
			setShowNewField(false);
			reset();
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setReqError);
		},
	});

	return (
		<div className="my-3">
			{!showNewField && (
				<button
					aria-expanded={showNewField}
					onClick={() => {
						clearErrors();
						setShowNewField((val) => !val);
					}}
					className="flex place-items-center gap-1.5 text-gray-700 font-normal py-1.5 px-2 hover:outline outline-2 rounded outline-dodger-500 text-bb"
				>
					<span className="ic ic-add ic-black"></span>
					<span>Create new field</span>
				</button>
			)}
			<div aria-hidden={!showNewField} className="aria-hidable my-2 rounded-lg">
				<h4 className="font-medium mt-10 mb-4 text-md">Create new field</h4>
				{reqError && <p className="text-red-700 text-bb my-1.5 leading-5">{reqError}</p>}
				<form
					onSubmit={handleSubmit((d) => {
						mutation.mutate(JSON.stringify([d]));
					})}
				>
					<fieldset>
						<div className="pb-1.5 text-sm text-gray-600">
							Select type{" "}
							<span className="text-red-500 font-bold" title="Required">
								*
							</span>
						</div>
						<select
							className="bg-white border-gray-300 border rounded-md px-4 py-2"
							{...register("t", {required: "Choose field type"})}
						>
							{FIELDS.map((option) => {
								return (
									<option
										onClick={() => {
											if (option.extra) {
												setExtraDate(option.extra);
											} else if (extraData) {
												setExtraDate(null);
											}
										}}
										value={option.type}
										key={option.name}
									>
										{option.name}
									</option>
								);
							})}
						</select>
						{extraData && (
							<>
								{extraData.type === "text" ? (
									<InputField
										elementHookFormRegister={register}
										elementId="dV"
										elementInputType="text"
										elementLabel={extraData.name}
										elementHookFormErrors={errors}
										elementIsRequired={true}
									/>
								) : extraData.type === "select" ? (
									<FetchItemsAndSelect
										hookFormRegister={register}
										label={extraData.name}
										item_type_id={id}
									/>
								) : (
									<></>
								)}
							</>
						)}
						{errors && errors["t"] && (
							<p className="text-red-700 text-bb my-1.5 leading-5">
								{errors["t"]?.message?.toString()}
							</p>
						)}
						{
							<>
								<InputField
									elementInputType="text"
									elementId="n"
									elementLabel="Field name"
									elementHookFormErrors={errors}
									elementHookFormRegister={register}
									elementIsRequired={true}
									elementInputMinLength={2}
									elementInputMaxLength={24}
								/>
								<div className="mt-6 flex gap-3">
									<Button
										elementState={mutation.isLoading ? "loading" : "default"}
										elementStyle="black"
										elementSize="base"
										elementChildren="Add field"
										elementType="submit"
									/>
									<Button
										elementState="default"
										elementInvert={true}
										elementStyle="black"
										elementSize="base"
										elementChildren="Cancel"
										elementType="button"
										onClick={() => {
											setShowNewField(false);
											reset();
										}}
									/>
								</div>
							</>
						}
					</fieldset>
				</form>
			</div>
		</div>
	);
}

function FetchItemsAndSelect({
	hookFormRegister,
	label,
	item_type_id,
}: {
	hookFormRegister: UseFormRegister<FieldValues>;
	label: string;
	item_type_id: string | number;
}) {
	const [data, setData] = useState<{n: string; v: string}[]>([]);

	useEffect(() => {
		getAllItemTypes().then((data) => {
			setData(
				data.data
					.map((item: ItemTypeType) => {
						return {n: item.name, v: item.id};
					})
					.filter((a: {v: string; n: string}) => a.v.toString() !== item_type_id.toString())
			);
		});
	}, [item_type_id]);

	return data?.length > 0 ? (
		<SelectField data={data} hookFormRegister={hookFormRegister} label={label} id="dV" />
	) : (
		<span className="text-red-700 text-bb my-1.5 leading-5 px-4">
			No other items are available.
		</span>
	);
}
