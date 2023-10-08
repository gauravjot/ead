import {dateTimePretty, timeSince} from "../../../utils/datetime";
import Button from "@/components/ui/Button";
import {useContext, useState} from "react";
import {AdminContext} from "@/components/Home";
import {useForm} from "react-hook-form";
import InputField from "@/components/ui/InputField";
import {useMutation, useQuery} from "react-query";
import {AxiosError} from "axios";
import {getUser} from "@/services/user/get_user";
import {UserType} from "@/types/user";
import {updateUser} from "@/services/user/update_user";
import Spinner from "@/components/ui/Spinner";
import {handleAxiosError} from "@/components/utils/HandleAxiosError";

export default function UserDetailPanel({userID}: {userID: string}) {
	const adminContext = useContext(AdminContext);
	const userQuery = useQuery(["user_" + userID], () => getUser(adminContext.admin?.token, userID));
	const user: UserType | null = userQuery.isSuccess ? userQuery.data.data : null;

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
			return user
				? updateUser(adminContext.admin?.token, user?.id, d.name, d.title, d.email, d.phone)
				: Promise.reject();
		},
		onSuccess: () => {
			setChangeProfileReqError(null);
			reset2();
			userQuery.refetch();
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setChangeProfileReqError);
		},
	});

	return userQuery.isSuccess && user ? (
		<>
			<div className="border-b sticky top-0 z-[5]">
				<div className="flex gap-6 px-8 py-6">
					<div className="h-16 w-16 bg-gray-200 rounded-full flex place-items-center justify-center capitalize text-4xl text-gray-400">
						{user.name[0]}
					</div>
					<div>
						<h1 className="text-3xl tracking-tight">{user.name} </h1>
						<span className="text-gray-600 text-bb">{user.id}</span>
						<div className="text-gray-500">{user.title}</div>
					</div>
				</div>
				<div className="text-bb px-8 flex gap-6">
					<div className="text-dodger-700 border-b-2 border-dodger-600 p-2">Administer</div>
				</div>
			</div>
			<div className="mx-8 max-w-[1400px]">
				{/* profile information */}
				<h3 className="text-md font-medium text-gray-800 mb-4 mt-8">User Information</h3>
				<table className="text-gray-600 text-bb">
					<tbody>
						<tr>
							<td className="font-medium w-1/2 pb-1">Added on</td>
							<td>{dateTimePretty(user.created_at)}</td>
						</tr>
						<tr>
							<td className="font-medium w-1/2 py-1">Added by</td>
							<td>{user.created_by}</td>
						</tr>
						<tr>
							<td className="font-medium w-1/2 py-1">Updated</td>
							<td>{timeSince(user.updated_at)}</td>
						</tr>
						<tr>
							<td className="font-medium w-1/2 pt-1">Updated by</td>
							<td>{user.updated_by}</td>
						</tr>
					</tbody>
				</table>
				{/* ### update profile ### */}
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
							key={user.id + 2}
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
										defaultValue={user.name}
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
										defaultValue={user.title}
									/>
									<InputField
										elementId="email"
										elementInputType="email"
										elementHookFormRegister={register2}
										elementLabel="Email"
										elementInputMinLength={0}
										elementInputMaxLength={64}
										elementHookFormErrors={errors2}
										defaultValue={user.email}
									/>
									<InputField
										elementId="phone"
										elementInputType="text"
										elementHookFormRegister={register2}
										elementLabel="Phone"
										elementInputMinLength={0}
										elementInputMaxLength={20}
										elementHookFormErrors={errors2}
										defaultValue={user.phone}
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
		</>
	) : userQuery.isLoading ? (
		<div className="h-full flex place-items-center justify-center">
			<Spinner color="accent" size="xl" />
		</div>
	) : (
		<></>
	);
}
