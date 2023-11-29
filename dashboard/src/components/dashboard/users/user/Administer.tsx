import {useForm} from "react-hook-form";
import InputField from "@/components/ui/InputField";
import {useMutation, useQueryClient} from "react-query";
import {AxiosError} from "axios";
import {updateUser} from "@/services/user/update_user";
import {handleAxiosError} from "@/components/utils/HandleAxiosError";
import Button from "@/components/ui/Button";
import {UserType} from "@/types/user";
import {AdminType} from "@/types/admin";
import {useState} from "react";
import {dateTimePretty, timeSince} from "@/utils/datetime";

export interface IUserAdministerProps {
	user: UserType | null;
	admin: AdminType | null;
}

export default function UserAdminister(props: IUserAdministerProps) {
	const queryClient = useQueryClient();
	// update profile form and mutation
	const {
		register: register2,
		formState: {errors: errors2},
		reset: reset2,
		handleSubmit: handleSubmit2,
	} = useForm();
	const [changeProfileReqError, setChangeProfileReqError] = useState<string | null>(null);
	const changeProfileMutation = useMutation({
		mutationFn: (d: {title: string; name: string; email: string; phone: string}) => {
			return props.user
				? updateUser(props.admin?.token, props.user?.id, d.name, d.title, d.email, d.phone)
				: Promise.reject();
		},
		onSuccess: () => {
			setChangeProfileReqError(null);
			reset2();
			queryClient.resetQueries(["user_" + props.user?.id]);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setChangeProfileReqError);
		},
	});
	return (
		props.user && (
			<div className="mx-8 max-w-[1400px]">
				{/* profile information */}
				<h3 className="text-md font-medium text-gray-800 mb-4 mt-8">User Information</h3>
				<table className="text-gray-600 text-bb">
					<tbody>
						<tr>
							<td className="font-medium w-1/2 pb-1">Added on</td>
							<td>{dateTimePretty(props.user.created_at)}</td>
						</tr>
						<tr>
							<td className="font-medium w-1/2 py-1">Added by</td>
							<td>{props.user.created_by}</td>
						</tr>
						<tr>
							<td className="font-medium w-1/2 py-1">Updated</td>
							<td>{timeSince(props.user.updated_at)}</td>
						</tr>
						<tr>
							<td className="font-medium w-1/2 pt-1">Updated by</td>
							<td>{props.user.updated_by}</td>
						</tr>
					</tbody>
				</table>
				<div className="border-t grid grid-cols-2 gap-6 my-8 pt-2">
					<div>
						<h3 className="text-md font-medium text-gray-800 my-4">Update Profile</h3>
						<p className="text-bb text-gray-500">Make changes to user profile.</p>
						{changeProfileMutation.isError && (
							<p className="text-bb text-red-700 my-4">
								{changeProfileReqError || "Unable to reach server."}
							</p>
						)}
						{changeProfileMutation.isSuccess && (
							<p className="text-bb text-green-700 my-4">Changes have been saved.</p>
						)}
					</div>
					<div className="mt-[2.75rem]">
						<form
							key={props.user.id + 2}
							onSubmit={handleSubmit2((d) => {
								changeProfileMutation.mutate(JSON.parse(JSON.stringify(d)));
							})}
						>
							<fieldset>
								<div>
									<InputField
										elementId="name"
										elementInputType="text"
										elementHookFormRegister={register2}
										elementLabel="Full name"
										elementInputMinLength={2}
										elementInputMaxLength={48}
										elementIsRequired={true}
										elementHookFormErrors={errors2}
										defaultValue={props.user.name}
									/>
									<InputField
										elementId="title"
										elementInputType="text"
										elementHookFormRegister={register2}
										elementLabel="Title"
										elementInputMinLength={2}
										elementInputMaxLength={48}
										elementIsRequired={true}
										elementHookFormErrors={errors2}
										defaultValue={props.user.title}
									/>
									<InputField
										elementId="email"
										elementInputType="email"
										elementHookFormRegister={register2}
										elementLabel="Email"
										elementInputMinLength={0}
										elementInputMaxLength={64}
										elementHookFormErrors={errors2}
										defaultValue={props.user.email}
									/>
									<InputField
										elementId="phone"
										elementInputType="text"
										elementHookFormRegister={register2}
										elementLabel="Phone"
										elementInputMinLength={0}
										elementInputMaxLength={20}
										elementHookFormErrors={errors2}
										defaultValue={props.user.phone}
									/>
								</div>

								<div className="mt-6">
									<Button
										elementState={changeProfileMutation.isLoading ? "loading" : "default"}
										elementStyle="black"
										elementSize="base"
										elementChildren="Update"
										elementType="submit"
									/>
								</div>
							</fieldset>
						</form>
					</div>
				</div>
			</div>
		)
	);
}
