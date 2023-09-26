import { AdminContext } from "@/components/Home";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { AddUserType, addUser } from "@/services/user/add_user";
import { AdminEntryType } from "@/types/admin";
import { ErrorType } from "@/types/api";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

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
		formState: { errors },
	} = useForm();

	const mutation = useMutation({
		mutationFn: (payload: AddUserType) => {
			return addUser(adminContext.admin?.token, payload);
		},
		onSuccess: (data) => {
			setReqError(null);
			reset();
			setReqResponse(data.data.user);
			queryClient.resetQueries(["user_list"]);
		},
		onError: (error: AxiosError) => {
			if (error.response) {
				const res = error.response.data as ErrorType;
				setReqError(res.message.toString());
			}
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
							state="default"
							styleType="black"
							type="button"
							children="Add another"
							onClick={() => {
								setReqResponse(null);
								mutation.reset();
							}}
						/>
						<Button
							state="default"
							styleType="black"
							type="button"
							children="Close"
							outline={true}
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

								<InputField
									id="title"
									inputType="text"
									register={register}
									label="Job Title"
									isRequired={true}
									errors={errors}
									width="full"
									maxLength={48}
								/>
							</div>
							<div>
								<InputField
									id="email"
									minLength={0}
									maxLength={64}
									inputType="text"
									register={register}
									label="Email"
									errors={errors}
									width="full"
								/>
								<InputField
									id="phone"
									inputType="text"
									register={register}
									label="Phone"
									minLength={0}
									maxLength={20}
									errors={errors}
									width="full"
								/>
							</div>
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
								children="Add user"
								type="submit"
							/>
						</div>
					</fieldset>
				</form>
			)}
		</div>
	);
}
