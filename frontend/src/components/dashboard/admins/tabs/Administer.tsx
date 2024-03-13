import {AxiosError} from "axios";
import {ErrorType} from "@/types/api";
import {changePassword} from "@/services/admins/change_password";
import {enableAdmin} from "@/services/admins/enable_admin";
import {handleAxiosError} from "@/components/utils/HandleAxiosError";
import {AdminEntryType} from "@/types/admin";
import {useForm} from "react-hook-form";
import InputField from "@/components/ui/InputField";
import {dateTimePretty, timeSince} from "@/utils/datetime";
import Button from "@/components/ui/Button";
import {useContext, useState} from "react";
import {useMutation, useQueryClient} from "react-query";
import {disableAdmin} from "@/services/admins/disable_admin";
import {AdminContext} from "@/App";

export interface IAdminAdministerProps {
	admin: AdminEntryType;
}

export function AdminAdminister(props: IAdminAdministerProps) {
	const queryClient = useQueryClient();
	const adminContext = useContext(AdminContext);

	// change password form and mutation
	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: {errors},
	} = useForm();
	const [reqError, setReqError] = useState<string | null>(null);
	const changePswdMutation = useMutation({
		mutationFn: (password: string) => {
			return changePassword(props.admin.username, password);
		},
		onSuccess: () => {
			setReqError(null);
			reset();
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setReqError);
		},
	});

	// disable admin form and mutation
	const [disableAdminReqError, setDisableAdminReqError] = useState<string | null>(null);
	const disableAdminMutation = useMutation({
		mutationFn: () => {
			return disableAdmin(props.admin.username);
		},
		onSuccess: () => {
			disableAdminMutation.reset();
			setDisableAdminReqError(null);
			queryClient.invalidateQueries(["admin_" + props.admin.username]);
			queryClient.invalidateQueries(["admin_list"]);
		},
		onError: (error: AxiosError) => {
			if (error.response) {
				const res = error.response.data as ErrorType;
				setDisableAdminReqError(res.message);
			}
		},
	});

	// enable admin form and mutation
	const [enableAdminReqError, setEnableAdminReqError] = useState<string | null>(null);
	const enableAdminMutation = useMutation({
		mutationFn: () => {
			return enableAdmin(props.admin.username);
		},
		onSuccess: () => {
			enableAdminMutation.reset();
			setEnableAdminReqError(null);
			queryClient.invalidateQueries(["admin_" + props.admin.username]);
			queryClient.invalidateQueries(["admin_list"]);
		},
		onError: (error: AxiosError) => {
			if (error.response) {
				const res = error.response.data as ErrorType;
				setEnableAdminReqError(res.message);
			}
		},
	});

	return (
		<div className="mx-8 max-w-[1400px]">
			{/* change password */}
			<div className="grid grid-cols-2 gap-6 mb-8 mt-4">
				<div>
					<h3 className="text-md font-medium text-gray-800 my-4">Change Password</h3>
					<p className="text-bb text-gray-500">
						Enter new password and click change to reset the password.
					</p>
					{props.admin && props.admin.username !== "root" && props.admin.username === "root" && (
						<p className="text-bb text-red-700 my-4">
							You cannot change root password. Use root account instead.
						</p>
					)}
					{changePswdMutation.isError && (
						<p className="text-bb text-red-700 my-4">{reqError || "Unable to reach server."}</p>
					)}
					{changePswdMutation.isSuccess && (
						<p className="text-bb text-green-700 my-4">Password has been changed.</p>
					)}
				</div>
				<div className="mt-[2.75rem]">
					<form
						key={props.admin.username + 1}
						onSubmit={handleSubmit((d) => {
							changePswdMutation.mutate(JSON.parse(JSON.stringify(d["password"])));
						})}
					>
						<fieldset
							disabled={
								(adminContext.admin?.admin.username !== "root" &&
									props.admin.username === "root") ||
								changePswdMutation.isLoading
							}
						>
							<div>
								<InputField
									elementId="password"
									elementInputType="password"
									elementHookFormRegister={register}
									elementLabel="New password"
									elementInputMinLength={8}
									elementInputMaxLength={96}
									elementIsPassword={true}
									elementIsRequired={true}
									elementHookFormErrors={errors}
								/>
								<InputField
									elementId="confirm_password"
									elementInputType="password"
									elementHookFormRegister={register}
									elementLabel="Confirm new password"
									elementInputMinLength={8}
									elementInputMaxLength={96}
									elementIsRequired={true}
									elementHookFormErrors={errors}
									elementHookFormWatch={watch}
									elementHookFormWatchField="password"
								/>
							</div>

							<div className="mt-6">
								<Button
									elementState={changePswdMutation.isLoading ? "loading" : "default"}
									elementStyle="black"
									elementSize="base"
									elementChildren="Change password"
									elementType="submit"
								/>
							</div>
						</fieldset>
					</form>
				</div>
			</div>
			{/* ### disable account ### */}
			<div className="border-t grid grid-cols-2 gap-6 my-8 pt-2">
				<div>
					<h3 className="text-md font-medium text-gray-800 my-4">Disable Account</h3>
					<p className="text-bb text-gray-500">
						Account can be enabled at a later date if required. Accounts cannot be deleted.
					</p>
					{disableAdminMutation.isError && (
						<p className="text-bb text-red-700 my-4">
							{disableAdminReqError || "Unable to reach server."}
						</p>
					)}
					{enableAdminMutation.isError && (
						<p className="text-bb text-red-700 my-4">
							{enableAdminReqError || "Unable to reach server."}
						</p>
					)}
				</div>
				<div className="mt-[2.75rem]">
					{props.admin.active ? (
						<>
							<p className="text-gray-700 text-bb mb-4">Account is enabled.</p>
							<Button
								elementState={
									disableAdminMutation.isLoading
										? "loading"
										: disableAdminMutation.isSuccess
										? "done"
										: "default"
								}
								elementStyle="danger"
								elementSize="base"
								elementInvert={true}
								elementType="button"
								elementChildren="DISABLE ACCOUNT"
								onClick={() => {
									disableAdminMutation.mutate();
								}}
								elementDisabled={
									props.admin.username === "root" ||
									props.admin.username == adminContext.admin?.admin.username
								}
							/>
						</>
					) : (
						<>
							<p className="text-red-700 text-bb font-medium mb-4">Account is disabled.</p>
							<Button
								elementState={
									enableAdminMutation.isLoading
										? "loading"
										: enableAdminMutation.isSuccess
										? "done"
										: "default"
								}
								elementStyle="primary"
								elementSize="base"
								elementInvert={true}
								elementType="button"
								elementChildren="Enable"
								onClick={() => {
									enableAdminMutation.mutate();
								}}
							/>
						</>
					)}
					{props.admin.username === "root" ? (
						<p className="my-2 text-gray-600 text-sm">Root account cannot be disabled.</p>
					) : props.admin.username == adminContext.admin?.admin.username ? (
						<p className="my-2 text-gray-600 text-sm">
							Use root account to disable your own account.
						</p>
					) : (
						<></>
					)}
				</div>
			</div>
			{/* profile information */}
			<div className="border-t my-8 pt-2">
				<h3 className="text-md font-medium text-gray-800 mb-4 my-4">Information</h3>
				<table className="text-gray-600 text-bb">
					<tbody>
						<tr>
							<td className="font-medium w-1/2 pb-1">Added on</td>
							<td>{dateTimePretty(props.admin.created_at)}</td>
						</tr>
						<tr>
							<td className="font-medium w-1/2 py-1">Added by</td>
							<td>{props.admin.created_by}</td>
						</tr>
						<tr>
							<td className="font-medium w-1/2 py-1">Updated</td>
							<td>{timeSince(props.admin.updated_at)}</td>
						</tr>
						<tr>
							<td className="font-medium w-1/2 pt-1">Updated by</td>
							<td>{props.admin.updated_by}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
