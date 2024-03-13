import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import {handleAxiosError} from "@/components/utils/HandleAxiosError";
import {AddItemType, addItem} from "@/services/item/add_item";
import {getItems} from "@/services/item/get_items";
import {getAllUsers} from "@/services/user/all_users";
import {ItemTypeType, CustomFieldType, ItemType} from "@/types/item";
import {UserType} from "@/types/user";
import {AxiosError} from "axios";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {FieldErrors, FieldValues, UseFormRegister, useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";

export default function AddNewItem({
	setShowAddItemBox,
	itemType,
}: {
	setShowAddItemBox: Dispatch<SetStateAction<boolean>>;
	itemType: ItemTypeType;
}) {
	const queryClient = useQueryClient();
	const [reqError, setReqError] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		reset,
		formState: {errors},
	} = useForm();
	const mutation = useMutation({
		mutationFn: (payload: AddItemType) => {
			return addItem(payload);
		},
		onSuccess: () => {
			setReqError(null);
			reset();
			setShowAddItemBox(false);
			queryClient.invalidateQueries(["items_" + itemType.id]);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setReqError);
		},
	});

	return (
		<div className="fixed inset-0 bg-black/10 z-50">
			<div
				className="absolute inset-0 z-5"
				onClick={() => {
					setShowAddItemBox(false);
				}}
			></div>
			<div className="relative z-10 bg-white px-6 py-10 shadow max-h-screen w-full overflow-y-auto">
				<div className="container mx-auto">
					<div className="flex flex-row">
						<h1 className="text-2xl flex-1 font-bold tracking-tight">Add new item</h1>
						<div>
							<Button
								elementChildren={""}
								elementState="default"
								elementStyle="border_opaque"
								elementType="button"
								elementIcon="close"
								elementSize="small"
								onClick={() => {
									setShowAddItemBox(false);
								}}
							/>
						</div>
					</div>
					<form
						onSubmit={handleSubmit((d) => {
							// Add new item
							const v = JSON.parse(JSON.stringify(d));
							const r = Object.create(null);
							r["name"] = v["name"];
							delete v["name"];
							const f: {n: string; v: string}[] = [];
							for (const [key, value] of Object.entries(v)) {
								f.push({n: key as string, v: value as string});
							}
							r["value"] = f;
							r["item_type"] = itemType.id;
							mutation.mutate(r);
						})}
					>
						<fieldset>
							{reqError && <p className="text-red-700 my-4">{reqError.toString()}</p>}
							<div className="mt-6">
								<h2 className="text-md font-medium text-gray-800">General Information</h2>
								<InputField
									elementInputType="text"
									elementId="name"
									elementLabel="Name"
									elementHookFormRegister={register}
									elementHookFormErrors={errors}
									elementIsRequired={true}
									elementInputMaxLength={48}
									elementWidth="full"
								/>
								<h2 className="text-md mt-6 font-medium text-gray-800">Fields</h2>
								{itemType.template?.map((field) => {
									return (
										<CustomInputField
											hookFormRegister={register}
											hookFormErrors={errors}
											field={field}
										/>
									);
								})}
							</div>
							<div className="mt-6 flex gap-6 justify-center">
								<Button
									elementState="default"
									elementStyle="black"
									elementInvert={true}
									elementSize="base"
									elementChildren="Reset"
									elementType="reset"
									onClick={() => {
										reset();
									}}
								/>
								<Button
									elementState={
										mutation.isLoading ? "loading" : mutation.isSuccess ? "done" : "default"
									}
									elementStyle="black"
									elementSize="base"
									elementChildren="Add item"
									elementType="submit"
								/>
							</div>
						</fieldset>
					</form>
				</div>
			</div>
		</div>
	);
}

export function CustomInputField({
	field,
	hookFormRegister,
	hookFormErrors,
}: {
	field: CustomFieldType;
	hookFormRegister: UseFormRegister<FieldValues>;
	hookFormErrors: FieldErrors<FieldValues>;
}) {
	const [IField, setIField] = useState<JSX.Element>();

	// Decide field type: input, textarea, select, checkbox
	useEffect(() => {
		if (["email", "number", "text", "phone", "url", "longtext"].includes(field.t)) {
			// Do a basic InputField
			setIField(
				<InputField
					elementHookFormRegister={hookFormRegister}
					elementId={field.n.replace(" ", "_")}
					elementInputType={
						field.t === "email"
							? "email"
							: field.t === "number" || field.t === "phone"
							? "number"
							: field.t === "text" || field.t === "url"
							? "text"
							: "text"
					}
					elementLabel={field.n}
					elementIsRequired={true}
					elementHookFormErrors={hookFormErrors}
					elementIsTextarea={field.t === "longtext"}
					elementTextareaRows={3}
					elementWidth="full"
				/>
			);
		} else if (field.t === "user") {
			getAllUsers().then((data) => {
				setIField(
					<SelectField
						data={data.data.map((user: UserType) => {
							return {n: `${user.name} (ID: ${user.id})`, v: user.id};
						})}
						hookFormRegister={hookFormRegister}
						label={field.n}
						id={field.n.replace(" ", "_")}
						elementWidth="full"
					/>
				);
			});
		} else if (field.t === "db_item_type" && field.dV) {
			getItems(field.dV).then((data) => {
				setIField(
					<SelectField
						data={data.data.map((item: ItemType) => {
							return {n: item.name, v: item.id};
						})}
						hookFormRegister={hookFormRegister}
						label={field.n}
						id={field.n.replace(" ", "_")}
						elementWidth="full"
					/>
				);
			});
		} else if (field.t === "boolean") {
			setIField(
				<label
					key={field.n}
					htmlFor={field.n.replace(" ", "_")}
					className="flex place-items-center w-full mt-6 mb-4 text-bb text-gray-600 group cursor-pointer"
				>
					<span className="flex-1">{field.n}</span>
					<input
						type="checkbox"
						id={field.n.replace(" ", "_")}
						{...hookFormRegister(field.n.replace(" ", "_"))}
					/>
				</label>
			);
		} else if (field.t === "currency") {
			setIField(
				<InputField
					elementHookFormRegister={hookFormRegister}
					elementId={field.n.replace(" ", "_")}
					elementInputType="number"
					elementInputDecimal={true}
					elementInputBoxLabel={field.dV || ""}
					elementLabel={field.n}
					elementIsRequired={true}
					elementHookFormErrors={hookFormErrors}
					elementWidth="full"
				/>
			);
		}
	}, [field.dV, field.n, field.t, hookFormErrors, hookFormRegister]);

	return IField;
}
