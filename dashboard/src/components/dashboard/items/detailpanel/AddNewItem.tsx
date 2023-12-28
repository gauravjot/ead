import {AdminContext} from "@/components/Home";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import {handleAxiosError} from "@/components/utils/HandleAxiosError";
import {AddItemType, addItem} from "@/services/item/add_item";
import {ItemTypeType} from "@/types/item";
import {AxiosError} from "axios";
import {Dispatch, SetStateAction, useContext, useState} from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";

export default function AddNewItem({
	setShowAddItemBox,
	itemType,
}: {
	setShowAddItemBox: Dispatch<SetStateAction<boolean>>;
	itemType: ItemTypeType;
}) {
	const adminContext = useContext(AdminContext);
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
			return addItem(adminContext.admin?.token, payload);
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
			<div className="absolute inset-0 z-5" onClick={()=>{setShowAddItemBox(false)}}></div>
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
								return field.t !== "boolean" ? (
									<InputField
										key={field.n}
										elementInputType={field.t as "number" | "text"}
										elementId={field.n.replace(" ", "_")}
										elementLabel={field.n}
										elementHookFormRegister={register}
										elementHookFormErrors={errors}
										elementIsRequired={true}
										elementWidth="full"
									/>
								) : (
									<label
										key={field.n}
										htmlFor={field.n.replace(" ", "_")}
										className="flex place-items-center w-full mt-6 mb-4 text-bb text-gray-600 group cursor-pointer"
									>
										<span className="flex-1">{field.n}</span>
										<input
											type="checkbox"
											id={field.n.replace(" ", "_")}
											{...register(field.n.replace(" ", "_"))}
										/>
									</label>
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
