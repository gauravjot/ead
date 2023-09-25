import { AdminContext } from "@/components/Home";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { addItemTypeFields } from "@/services/item/add_item_type_field";
import { ErrorType } from "@/types/api";
import { AxiosError } from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

export default function AddNewField({ id }: { id: number | string }) {
	const adminContext = useContext(AdminContext);
	const queryClient = useQueryClient();
	const [showNewField, setShowNewField] = useState<boolean>(false);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const [reqError, setReqError] = useState<string | null>(null);
	const mutation = useMutation({
		mutationFn: (fields: string) => {
			return adminContext.admin
				? addItemTypeFields(adminContext.admin?.token, id, fields)
				: Promise.reject();
		},
		onSuccess: () => {
			setReqError(null);
			queryClient.resetQueries(["item_type_" + id]);
			setShowNewField(false);
			reset();
		},
		onError: (error: AxiosError) => {
			if (error.response) {
				const res = error.response.data as ErrorType;
				setReqError(res.message);
			}
		},
	});

	return (
		<div className="my-3">
			<button
				aria-expanded={showNewField}
				onClick={() => {
					setShowNewField((val) => !val);
				}}
				className="flex place-items-center gap-2 text-dodger-700 font-normal py-1.5 px-2 hover:bg-dodger-100"
			>
				<span className="ic ic-add ic-accent"></span>
				{" New Field"}
			</button>
			<div aria-hidden={!showNewField} className="aria-hidable my-2 rounded-lg p-4">
				<form
					onSubmit={handleSubmit((d) => {
						console.log(d);
						console.log(errors);
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
						<div className={"flex gap-4 my-1 mb-2.5"}>
							<div>
								<input
									type="radio"
									id="text"
									value="text"
									{...register("t", { required: "Choose field type" })}
								/>
								<label
									className="pl-2 cursor-pointer text-bb"
									htmlFor="text"
								>
									Text
								</label>
							</div>
							<div>
								<input
									type="radio"
									id="number"
									value="number"
									{...register("t", { required: "Choose field type" })}
								/>
								<label
									className="pl-2 cursor-pointer text-bb"
									htmlFor="number"
								>
									Number
								</label>
							</div>
							<div>
								<input
									type="radio"
									id="boolean"
									value="boolean"
									{...register("t", { required: "Choose field type" })}
								/>
								<label
									className="pl-2 cursor-pointer text-bb"
									htmlFor="boolean"
								>
									Boolean
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
									inputType="text"
									id="n"
									label="Field name"
									errors={errors}
									register={register}
									isRequired={true}
									minLength={2}
									maxLength={24}
								/>
								<div className="mt-6">
									<Button
										state={mutation.isLoading ? "loading" : "default"}
										styleType="black"
										size="base"
										children="Add field"
										type="submit"
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
