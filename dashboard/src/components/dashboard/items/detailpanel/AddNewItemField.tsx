import {AdminContext} from "@/components/Home";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import {handleAxiosError} from "@/components/utils/HandleAxiosError";
import {addItemTypeFields} from "@/services/item/item_type/add_item_type_field";
import {AxiosError} from "axios";
import {useContext, useState} from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";

export default function AddNewItemField({id}: {id: number | string}) {
	const adminContext = useContext(AdminContext);
	const queryClient = useQueryClient();
	const [showNewField, setShowNewField] = useState<boolean>(false);
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
			return adminContext.admin
				? addItemTypeFields(adminContext.admin?.token, id, fields)
				: Promise.reject();
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
						<div className="flex gap-4 my-1 mb-2.5">
							<div>
								<input
									type="radio"
									id="text"
									value="text"
									{...register("t", {required: "Choose field type"})}
								/>
								<label className="pl-2 cursor-pointer text-bb" htmlFor="text">
									Short Text
								</label>
							</div>
							<div>
								<input
									type="radio"
									id="number"
									value="number"
									{...register("t", {required: "Choose field type"})}
								/>
								<label className="pl-2 cursor-pointer text-bb" htmlFor="number">
									Number
								</label>
							</div>
							<div>
								<input
									type="radio"
									id="decimal"
									value="decimal"
									{...register("t", {required: "Choose field type"})}
								/>
								<label className="pl-2 cursor-pointer text-bb" htmlFor="decimal">
									Decimal
								</label>
							</div>
							<div>
								<input
									type="radio"
									id="boolean"
									value="boolean"
									{...register("t", {required: "Choose field type"})}
								/>
								<label className="pl-2 cursor-pointer text-bb" htmlFor="boolean">
									Boolean
								</label>
							</div>
							<div>
								<input
									type="radio"
									id="paragraph"
									value="paragraph"
									{...register("t", {required: "Choose field type"})}
								/>
								<label className="pl-2 cursor-pointer text-bb" htmlFor="paragraph">
									Paragraph
								</label>
							</div>
							<div>
								<input
									type="radio"
									id="multiple"
									value="multiple"
									{...register("t", {required: "Choose field type"})}
								/>
								<label className="pl-2 cursor-pointer text-bb" htmlFor="multiple">
									Multiple
								</label>
							</div>
						</div>
						<div className="flex gap-4 my-1 mb-2.5">
							<div>
								<input
									type="radio"
									id="date"
									value="date"
									{...register("t", {required: "Choose field type"})}
								/>
								<label className="pl-2 cursor-pointer text-bb" htmlFor="date">
									Date
								</label>
							</div>
							<div>
								<input
									type="radio"
									id="time"
									value="time"
									{...register("t", {required: "Choose field type"})}
								/>
								<label className="pl-2 cursor-pointer text-bb" htmlFor="time">
									Time
								</label>
							</div>

							<div>
								<input
									type="radio"
									id="datetime"
									value="datetime"
									{...register("t", {required: "Choose field type"})}
								/>
								<label className="pl-2 cursor-pointer text-bb" htmlFor="datetime">
									Date and Time
								</label>
							</div>
							<div>
								<input
									type="radio"
									id="currency"
									value="currency"
									{...register("t", {required: "Choose field type"})}
								/>
								<label className="pl-2 cursor-pointer text-bb" htmlFor="currency">
									Currency
								</label>
							</div>
							<div>
								<input
									type="radio"
									id="url"
									value="url"
									{...register("t", {required: "Choose field type"})}
								/>
								<label className="pl-2 cursor-pointer text-bb" htmlFor="url">
									URL
								</label>
							</div>
							<div>
								<input
									type="radio"
									id="phone"
									value="phone"
									{...register("t", {required: "Choose field type"})}
								/>
								<label className="pl-2 cursor-pointer text-bb" htmlFor="phone">
									Phone
								</label>
							</div>
							<div>
								<input
									type="radio"
									id="email"
									value="email"
									{...register("t", {required: "Choose field type"})}
								/>
								<label className="pl-2 cursor-pointer text-bb" htmlFor="email">
									Email
								</label>
							</div>
						</div>
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
