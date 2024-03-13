import {useForm} from "react-hook-form";
import InputField from "@/components/ui/InputField";
import {useMutation, useQueryClient} from "react-query";
import {AxiosError} from "axios";
import {handleAxiosError} from "@/components/utils/HandleAxiosError";
import Button from "@/components/ui/Button";
import {useState} from "react";
import {dateTimePretty} from "@/utils/datetime";
import {DualColumnTable} from "@/components/ui/table/DualColumnDetailTable";
import {UserType} from "@/types/user";
import {UpdateUserType, updateUser} from "@/services/user/update_user";
import {deleteUser} from "@/services/user/delete_user";
import {Link} from "react-router-dom";

export interface IClientAdministerProps {
	user: UserType;
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
		mutationFn: (d: UpdateUserType["d"]) => {
			return props.user ? updateUser({id: props.user?.id, d}) : Promise.reject();
		},
		onSuccess: () => {
			setChangeProfileReqError(null);
			reset2();
			queryClient.invalidateQueries(["user_" + props.user?.id]);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setChangeProfileReqError);
		},
	});

	const [deleteCheckbox, setDeleteCheckbox] = useState<boolean>(false);
	const [deleteItemTypeReqError, setDeleteItemTypeReqError] = useState<string | null>(null);
	const deleteItemTypeMutation = useMutation({
		mutationFn: () => {
			return deleteUser(props.user?.id);
		},
		onSuccess: () => {
			queryClient.resetQueries(["user_" + props.user?.id]);
			queryClient.resetQueries(["user_list"]);
			setDeleteItemTypeReqError(null);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setDeleteItemTypeReqError);
		},
	});

	return (
		props.user && (
			<div className="mx-8 max-w-[1400px]">
				{/* profile information */}
				<h3 className="text-md font-medium text-gray-800 mb-4 mt-8">User Information</h3>
				<DualColumnTable
					left={[
						{title: "Full name", value: props.user.name},
						{title: "Title", value: props.user.title || "N/A"},
						{title: "Email", value: props.user.email || "N/A"},
						{title: "Phone", value: props.user.phone || "N/A"},
						{title: "User ID", value: props.user.id},
					]}
					right={[
						{title: "Last Updated", value: dateTimePretty(props.user.updated_at)},
						{title: "Updated by", value: props.user.updated_by},
						{title: "Added on", value: dateTimePretty(props.user.created_at)},
						{title: "Added by", value: props.user.created_by},
					]}
				/>

				{props.user.is_admin && (
					<div className="border-t my-8 pt-2">
						<h3 className="text-md font-medium text-gray-800 my-4">Admin</h3>
						<p className="text-bb text-gray-500 my-2">This user is attached to an Admin account.</p>
						<Link to={"/admins/" + props.user.is_admin} className="text-bb font-medium ml-4">
							View admin account
						</Link>
					</div>
				)}
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
										elementInputMaxLength={64}
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
										elementInputMaxLength={64}
										elementIsRequired={false}
										elementHookFormErrors={errors2}
										defaultValue={props.user.title || ""}
									/>
									<InputField
										elementId="email"
										elementInputType="email"
										elementHookFormRegister={register2}
										elementLabel="Email"
										elementInputMinLength={0}
										elementInputMaxLength={64}
										elementHookFormErrors={errors2}
										defaultValue={props.user.email || ""}
									/>
									<InputField
										elementId="phone"
										elementInputType="text"
										elementHookFormRegister={register2}
										elementLabel="Phone"
										elementInputMinLength={0}
										elementInputMaxLength={20}
										elementHookFormErrors={errors2}
										defaultValue={props.user.phone || ""}
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
				<div className="border-t grid grid-cols-2 gap-6 my-8 pt-2">
					<div>
						<h3 className="text-md font-medium text-gray-800 my-4">Delete User</h3>
						<p className="text-bb text-gray-500">This cannot be undone.</p>
						{deleteItemTypeMutation.isError && (
							<p className="text-bb text-red-700 my-4">
								{deleteItemTypeReqError || "Unable to reach server."}
							</p>
						)}
					</div>
					<div className="mt-14">
						<p className="text-gray-700 text-bb mb-4 flex gap-2">
							<input
								type="checkbox"
								id="continue-delete"
								onChange={(e) => {
									setDeleteCheckbox(e.target.checked);
								}}
							/>
							<label htmlFor="continue-delete">Yes, I am sure.</label>
						</p>
						<Button
							elementState={
								deleteItemTypeMutation.isLoading
									? "loading"
									: deleteItemTypeMutation.isSuccess
									? "done"
									: "default"
							}
							elementStyle="danger"
							elementSize="base"
							elementInvert={true}
							elementType="button"
							elementChildren="DELETE"
							onClick={() => {
								deleteItemTypeMutation.mutate();
							}}
							elementDisabled={deleteItemTypeMutation.isLoading || !deleteCheckbox}
						/>
					</div>
				</div>
			</div>
		)
	);
}
