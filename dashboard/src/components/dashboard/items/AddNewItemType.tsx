import { AdminContext } from "@/components/Home";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { AddItemTypeType, addItemType } from "@/services/item/add_item_type";
import { ErrorType } from "@/types/api";
import { ItemTypeType } from "@/types/item";
import { AxiosError } from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

export default function AddNewUser() {
	const adminContext = useContext(AdminContext);
	const [reqError, setReqError] = useState<string | null>(null);
	const [reqResponse, setReqResponse] = useState<ItemTypeType | null>(null);
  
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const mutation = useMutation({
		mutationFn: (payload: AddItemTypeType) => {
			return addItemType(adminContext.admin?.token, payload);
		},
		onSuccess: (data) => {
			setReqError(null);
			reset();
			setReqResponse(data.data);
		},
		onError: (error: AxiosError) => {
			if (error.response) {
				const res = error.response.data as ErrorType;
				setReqError(res.message.toString());
			} else {
        setReqError("Server Error");
      }
      console.log("errrrrr")
		},
	});

	return (
		<div>
			{reqError && <p className="text-red-700 my-2">{reqError}</p>}
			{reqResponse && (
				<div className="mt-2">
					<p className="text-gray-600">
						Item type is added successfully. You can close this window now.
					</p>
					<div className="mt-10">
						<Button
							state="default"
							styleType="black"
							type="button"
							children="Add another"
							onClick={() => {
								setReqResponse(null);
								mutation.reset();
							}}
						/>
					</div>
				</div>
			)}
			{!reqResponse && (
				<form
					onSubmit={handleSubmit((d) => {
						mutation.mutate(JSON.parse(JSON.stringify(d)));
					})}
				>
					<fieldset disabled={mutation.isLoading}>
						<p className="my-1 text-bb text-gray-500">* Required fields.</p>
						<div className="grid sm:grid-cols-2 grid-cols-1 gap-12">
							<div>
								<InputField
									id="name"
									isRequired={true}
									minLength={2}
									errors={errors}
									inputType="text"
									register={register}
									label="Name"
									width="full"
									maxLength={48}
								/>
							</div>
							<div>
											

								<InputField
									id="description"
									inputType="text"
									register={register}
									label="Descritpion"
									isRequired={true}
                  isTextarea={true}
									errors={errors}
									width="full"
									maxLength={25000}
								/>				</div>
						</div>

						<div className="mt-6 flex gap-6 justify-center">
							<Button
								state="default"
								styleType="black"
								outline={true}
								size="base"
								children="Reset"
								type="reset"
								onClick={() => {
									reset();
								}}
							/>
							<Button
								state={
									mutation.isLoading
										? "loading"
										: mutation.isSuccess
										? "done"
										: "default"
								}
								styleType="black"
								size="base"
								children="Add item"
								type="submit"
							/>
						</div>
					</fieldset>
				</form>
			)}
		</div>
	);
}
