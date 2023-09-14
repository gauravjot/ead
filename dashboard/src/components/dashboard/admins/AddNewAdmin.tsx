import { AdminContext } from "@/components/Home";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { AddAdminType, addAdmin } from "@/services/admins/add_admin";
import { AdminEntryType } from "@/types/admin";
import { ErrorType } from "@/types/api";
import { AxiosError } from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

export default function AddNewAdmin() {
	const adminContext = useContext(AdminContext);
	const [reqError, setReqError] = useState<string | null>(null);
	const [reqResponse, setReqResponse] = useState<AdminEntryType | null>(null);
	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm();

	const mutation = useMutation({
		mutationFn: (payload: AddAdminType) => {
			return addAdmin(adminContext.admin?.token, payload);
		},
		onSuccess: (data) => {
			setReqError(null);
			reset();
			setReqResponse(data.data.admin);
		},
		onError: (error: AxiosError) => {
			if (error.response) {
				const res = error.response.data as ErrorType;
				setReqError(res.message);
			}
		},
	});

	return (
		<div>
			{reqError && <p className="text-red-700 my-2">{reqError}</p>}
			{reqResponse && (
				<div className="mt-2">
					<p className="text-gray-600">
						Admin is added successfully. You can close this window now.
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
									id="full_name"
									isRequired={true}
									minLength={2}
									errors={errors}
									inputType="text"
									register={register}
									label="Full Name"
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
									id="username"
									minLength={2}
									maxLength={24}
									inputType="text"
									register={register}
									label="Username"
									isRequired={true}
									errors={errors}
									width="full"
								/>
								<InputField
									id="password"
									inputType="password"
									register={register}
									label="Password"
									minLength={8}
									maxLength={96}
									isRequired={true}
                  isPassword={true}
									errors={errors}
									width="full"
								/>
								<InputField
									id="confirm_password"
									inputType="password"
									register={register}
									label="Confirm Password"
									minLength={8}
									maxLength={96}
									isRequired={true}
									errors={errors}
									watch={watch}
									watchField="password"
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
