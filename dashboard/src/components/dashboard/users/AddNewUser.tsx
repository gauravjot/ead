import {AdminContext} from "@/components/Home";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import {handleAxiosError} from "@/components/utils/HandleAxiosError";
import {AddUserType, addUser} from "@/services/user/add_user";
import {AdminEntryType} from "@/types/admin";
import {AxiosError} from "axios";
import {Dispatch, SetStateAction, useContext, useState} from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";

export default function AddNewUser({
	setShowDialog,
}: {
	setShowDialog: Dispatch<SetStateAction<boolean>>;
}) {
	const adminContext = useContext(AdminContext);
	const [reqError, setReqError] = useState<string | null>(null);
	const queryClient = useQueryClient();
	const [reqResponse, setReqResponse] = useState<AdminEntryType | null>(null);
	const {
		register,
		handleSubmit,
		reset,
		formState: {errors},
	} = useForm();

	const mutation = useMutation({
		mutationFn: (payload: AddUserType) => {
			return addUser(adminContext.admin?.token, payload);
		},
		onSuccess: (data) => {
			setReqError(null);
			reset();
			setReqResponse(data.data);
			queryClient.resetQueries(["user_list"]);
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
						User is added successfully. You can close this window now.
					</p>
					<div className="mt-10 flex gap-4">
						<Button
							elementState="default"
							elementStyle="black"
							elementType="button"
							elementChildren="Add another"
							onClick={() => {
								setReqResponse(null);
								mutation.reset();
							}}
						/>
						<Button
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
						mutation.mutate(JSON.parse(JSON.stringify(d).replaceAll("aau_", "")));
					})}
				>
					<fieldset disabled={mutation.isLoading}>
						<p className="my-1 text-bb text-gray-500">* Required fields.</p>
						<div>
							<InputField
								elementId="aau_name"
								elementIsRequired={true}
								elementInputMinLength={2}
								elementHookFormErrors={errors}
								elementInputType="text"
								elementHookFormRegister={register}
								elementLabel="Full Name"
								elementWidth="full"
								elementInputMaxLength={48}
							/>
							<InputField
								elementId="aau_role"
								elementInputType="text"
								elementHookFormRegister={register}
								elementLabel="Role"
								elementIsRequired={true}
								elementHookFormErrors={errors}
								elementWidth="full"
								elementInputMaxLength={48}
							/>
							<InputField
								elementId="aau_email"
								elementInputMinLength={0}
								elementInputMaxLength={64}
								elementInputType="email"
								elementIsRequired={true}
								elementHookFormRegister={register}
								elementLabel="Email"
								elementHookFormErrors={errors}
								elementWidth="full"
							/>
							<InputField
								elementId="aau_phone"
								elementInputType="text"
								elementHookFormRegister={register}
								elementLabel="Phone"
								elementInputMinLength={0}
								elementInputMaxLength={20}
								elementHookFormErrors={errors}
								elementWidth="full"
							/>
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
								elementChildren="Add user"
								elementType="submit"
							/>
						</div>
					</fieldset>
				</form>
			)}
		</div>
	);
}
