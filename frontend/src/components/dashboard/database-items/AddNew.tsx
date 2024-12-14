import InputButton from "@/components/custom-ui/InputButton";
import InputField from "@/components/custom-ui/InputField";
import {AddItemTypeType, addItemType} from "@/services/item/item_type/add_item_type";
import {ItemTypeType} from "@/types/item";
import {AxiosError} from "axios";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {Dispatch, SetStateAction} from "react";
import {handleAxiosError} from "@/components/utils/HandleAxiosError";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export default function AddNewItemType({
	setShowDialog,
}: {
	setShowDialog: Dispatch<SetStateAction<boolean>>;
}) {
	const queryClient = useQueryClient();
	const [reqError, setReqError] = useState<string | null>(null);
	const [reqResponse, setReqResponse] = useState<ItemTypeType | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: {errors},
	} = useForm();

	const mutation = useMutation({
		mutationFn: (payload: AddItemTypeType) => {
			return addItemType(payload);
		},
		onSuccess: (data) => {
			setReqError(null);
			reset();
			setReqResponse(data.data);
			queryClient.resetQueries({queryKey: ["item_type_list"]});
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setReqError);
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
					<div className="mt-10 flex gap-4">
						<InputButton
							elementState="default"
							elementStyle="black"
							elementType="button"
							elementChildren="Add another"
							onClick={() => {
								setReqResponse(null);
								mutation.reset();
							}}
						/>
						<InputButton
							elementState="default"
							elementStyle="black"
							elementType="button"
							elementChildren="Close"
							elementInvert={true}
							onClick={() => {
								setShowDialog(false);
								mutation.reset();
								setReqResponse(null);
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
					<fieldset disabled={mutation.isPending}>
						<p className="my-1 text-bb text-gray-500">* Required fields.</p>
						<div className="grid sm:grid-cols-2 grid-cols-1 gap-12">
							<div>
								<InputField
									elementId="name"
									elementIsRequired={true}
									elementInputMinLength={2}
									elementHookFormErrors={errors}
									elementInputType="text"
									elementHookFormRegister={register}
									elementLabel="Name"
									elementWidth="full"
									elementInputMaxLength={48}
								/>
							</div>
							<div>
								<InputField
									elementId="description"
									elementInputType="text"
									elementHookFormRegister={register}
									elementLabel="Descritpion"
									elementIsRequired={true}
									elementIsTextarea={true}
									elementHookFormErrors={errors}
									elementWidth="full"
									elementInputMaxLength={25000}
								/>{" "}
							</div>
						</div>

						<div className="mt-6 flex gap-6 justify-center">
							<InputButton
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
							<InputButton
								elementState={
									mutation.isPending ? "loading" : mutation.isSuccess ? "done" : "default"
								}
								elementStyle="black"
								elementSize="base"
								elementChildren="Add item"
								elementType="submit"
							/>
						</div>
					</fieldset>
				</form>
			)}
		</div>
	);
}
