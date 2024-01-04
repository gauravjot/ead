import {useForm} from "react-hook-form";
import InputField from "@/components/ui/InputField";
import {useMutation, useQueryClient} from "react-query";
import {AxiosError} from "axios";
import {handleAxiosError} from "@/components/utils/HandleAxiosError";
import Button from "@/components/ui/Button";
import {ClientType} from "@/types/client";
import {AdminType} from "@/types/admin";
import {useState} from "react";
import {dateTimePretty, timeSince} from "@/utils/datetime";
import {updateClient} from "@/services/invoice/client/update_client";

export interface IClientAdministerProps {
	client: ClientType | null;
	admin: AdminType | null;
}

export default function ClientAdminister(props: IClientAdministerProps) {
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
			return props.client
				? updateClient(props.admin?.token, props.client?.id, d.name, d.title, d.email, d.phone)
				: Promise.reject();
		},
		onSuccess: () => {
			setChangeProfileReqError(null);
			reset2();
			queryClient.resetQueries(["client_" + props.client?.id]);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setChangeProfileReqError);
		},
	});
	return (
		props.client && (
			<div className="mx-8 max-w-[1400px]">
				{/* profile information */}
				<h3 className="text-md font-medium text-gray-800 mb-4 mt-8">Client Information</h3>
				<table className="text-gray-600 text-bb">
					<tbody>
						<tr>
							<td className="font-medium w-1/2 pb-1">Added on</td>
							<td>{dateTimePretty(props.client.created_at)}</td>
						</tr>
						<tr>
							<td className="font-medium w-1/2 py-1">Added by</td>
							<td>{props.client.created_by}</td>
						</tr>
						<tr>
							<td className="font-medium w-1/2 py-1">Updated</td>
							<td>{timeSince(props.client.updated_at)}</td>
						</tr>
						<tr>
							<td className="font-medium w-1/2 pt-1">Updated by</td>
							<td>{props.client.updated_by}</td>
						</tr>
					</tbody>
				</table>
				<div className="border-t grid grid-cols-2 gap-6 my-8 pt-2">
					<div>
						<h3 className="text-md font-medium text-gray-800 my-4">Update Profile</h3>
						<p className="text-bb text-gray-500">Make changes to client profile.</p>
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
							key={props.client.id + 2}
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
										elementLabel="Business name"
										elementInputMinLength={2}
										elementInputMaxLength={48}
										elementIsRequired={true}
										elementHookFormErrors={errors2}
										defaultValue={props.client.name}
									/>
									<InputField
										elementId="type"
										elementInputType="text"
										elementHookFormRegister={register2}
										elementLabel="Business type"
										elementInputMinLength={2}
										elementInputMaxLength={48}
										elementIsRequired={true}
										elementHookFormErrors={errors2}
										defaultValue={props.client.type}
									/>
									<InputField
										elementId="email"
										elementInputType="email"
										elementHookFormRegister={register2}
										elementLabel="Email"
										elementInputMinLength={0}
										elementInputMaxLength={64}
										elementHookFormErrors={errors2}
										defaultValue={props.client.email}
									/>
									<InputField
										elementId="phone"
										elementInputType="text"
										elementHookFormRegister={register2}
										elementLabel="Phone"
										elementInputMinLength={0}
										elementInputMaxLength={20}
										elementHookFormErrors={errors2}
										defaultValue={props.client.phone}
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
