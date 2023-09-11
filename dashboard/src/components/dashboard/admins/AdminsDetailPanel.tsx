import { dateTimePretty, timeSince } from "../../../utils/datetime";
import Button from "@/components/ui/Button";
import { useContext, useState } from "react";
import { AdminContext } from "@/components/Home";
import { useForm } from "react-hook-form";
import InputField from "@/components/ui/InputField";
import { useMutation, useQuery } from "react-query";
import { AxiosError } from "axios";
import { ErrorType } from "@/types/api";
import { changePassword } from "@/services/admins/change_password";
import { changeProfile } from "@/services/admins/change_profile";
import { getAdmin } from "@/services/admins/info_admin";
import { disableAdmin } from "@/services/admins/disable_admin";
import { enableAdmin } from "@/services/admins/enable_admin";
import Spinner from "@/components/ui/Spinner";

export default function AdminsDetailPanel({ adminID }: { adminID: string }) {
	const adminContext = useContext(AdminContext);
	const adminQuery = useQuery(["admin_" + adminID], () =>
		getAdmin(adminContext.admin?.token, adminID)
	);
	const admin = adminQuery.isSuccess ? adminQuery.data.data : null;

	// change password form and mutation
	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm();
	const [reqError, setReqError] = useState<string | null>(null);
	const changePswdMutation = useMutation({
		mutationFn: (password: string) => {
			return admin
				? changePassword(adminContext.admin?.token, admin?.username, password)
				: Promise.reject();
		},
		onSuccess: () => {
			setReqError(null);
			reset();
		},
		onError: (error: AxiosError) => {
			if (error.response) {
				const res = error.response.data as ErrorType;
				setReqError(res.message);
			}
		},
	});

	// update profile form and mutation
	const {
		register: register2,
		formState: { errors: errors2 },
		reset: reset2,
		handleSubmit: handleSubmit2,
	} = useForm();
	const [changeProfileReqError, setChangeProfileReqError] = useState<string | null>(
		null
	);
	const changeProfileMutation = useMutation({
		mutationFn: (d: { title: string; full_name: string }) => {
			return admin
				? changeProfile(
						adminContext.admin?.token,
						admin?.username,
						d.title,
						d.full_name
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  )
				: Promise.reject();
		},
		onSuccess: () => {
			setChangeProfileReqError(null);
			reset2();
			adminQuery.refetch();
		},
		onError: (error: AxiosError) => {
			if (error.response) {
				const res = error.response.data as ErrorType;
				setChangeProfileReqError(res.message);
			}
		},
	});

	// disable admin form and mutation
	const [disableAdminReqError, setDisableAdminReqError] = useState<string | null>(null);
	const disableAdminMutation = useMutation({
		mutationFn: () => {
			return admin
				? disableAdmin(adminContext.admin?.token, admin?.username)
				: Promise.reject();
		},
		onSuccess: () => {
			disableAdminMutation.reset();
			setDisableAdminReqError(null);
			adminQuery.refetch();
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
			return admin
				? enableAdmin(adminContext.admin?.token, admin?.username)
				: Promise.reject();
		},
		onSuccess: () => {
			enableAdminMutation.reset();
			setEnableAdminReqError(null);
			adminQuery.refetch();
		},
		onError: (error: AxiosError) => {
			if (error.response) {
				const res = error.response.data as ErrorType;
				setEnableAdminReqError(res.message);
			}
		},
	});

	return admin && adminQuery.isSuccess ? (
		<>
			<div className="border-b">
				<div className="flex gap-6 px-8 my-8">
					<div className="h-16 w-16 bg-gray-200 rounded-full flex place-items-center justify-center capitalize text-4xl text-gray-400">
						{admin.full_name[0]}
					</div>
					<div>
						<h1 className="text-3xl tracking-tight">{admin.full_name} </h1>
						<span className="text-gray-600 text-bb">@{admin.username}</span>
						<div className="text-gray-500">{admin.title}</div>
					</div>
				</div>
				<div className="text-bb px-8 flex gap-6">
					<div className="text-dodger-700 border-b-2 border-dodger-600 p-2">
						Administer
					</div>
				</div>
			</div>
			<div className="mx-8 max-w-[1400px]">
				{/* change password */}
				<div className="grid grid-cols-2 gap-6 mb-8 mt-4">
					<div>
						<h3 className="text-md font-medium text-gray-800 my-4">
							Change Password
						</h3>
						<p className="text-bb text-gray-500">
							Enter new password and click change to reset the password.
						</p>
						{adminContext &&
							adminContext.admin?.username !== "root" &&
							admin.username === "root" && (
								<p className="text-bb text-red-700 my-4">
									You cannot change root password. Use root account
									instead.
								</p>
							)}
						{changePswdMutation.isError && (
							<p className="text-bb text-red-700 my-4">
								{reqError || "Unable to reach server."}
							</p>
						)}
						{changePswdMutation.isSuccess && (
							<p className="text-bb text-green-700 my-4">
								Password has been changed.
							</p>
						)}
					</div>
					<div className="mt-[2.75rem]">
						<form
							key={admin.username + 1}
							onSubmit={handleSubmit((d) => {
								changePswdMutation.mutate(
									JSON.parse(JSON.stringify(d["password"]))
								);
							})}
						>
							<fieldset
								disabled={
									(adminContext &&
										adminContext.admin?.username !== "root" &&
										admin.username === "root") ||
									changePswdMutation.isLoading
								}
							>
								<div>
									<InputField
										id="password"
										inputType="password"
										register={register}
										label="New password"
										minLength={8}
										maxLength={96}
										isRequired={true}
										errors={errors}
									/>
									<InputField
										id="confirm_password"
										inputType="password"
										register={register}
										label="Confirm new password"
										minLength={8}
										maxLength={96}
										isRequired={true}
										errors={errors}
										watch={watch}
										watchField="password"
									/>
								</div>

								<div className="mt-6">
									<Button
										state={
											changePswdMutation.isLoading
												? "loading"
												: "default"
										}
										styleType="black"
										size="base"
										children="Change password"
										type="submit"
									/>
								</div>
							</fieldset>
						</form>
					</div>
				</div>
				{/* ### update profile ### */}
				<div className="border-t grid grid-cols-2 gap-6 my-8 pt-2">
					<div>
						<h3 className="text-md font-medium text-gray-800 my-4">
							Update Profile
						</h3>
						<p className="text-bb text-gray-500">
							Make changes to name and title of the admin.
						</p>
						{changeProfileMutation.isError && (
							<p className="text-bb text-red-700 my-4">
								{changeProfileReqError || "Unable to reach server."}
							</p>
						)}
						{changeProfileMutation.isSuccess && (
							<p className="text-bb text-green-700 my-4">
								Changes have been saved.
							</p>
						)}
					</div>
					<div className="mt-[2.75rem]">
						<form
							key={admin.username + 2}
							onSubmit={handleSubmit2((d) => {
								changeProfileMutation.mutate(
									JSON.parse(JSON.stringify(d))
								);
							})}
						>
							<fieldset>
								<div>
									<InputField
										id="full_name"
										inputType="text"
										register={register2}
										label="Full name"
										minLength={2}
										maxLength={48}
										isRequired={true}
										errors={errors2}
										defaultValue={admin.full_name}
									/>
									<InputField
										id="title"
										inputType="text"
										register={register2}
										label="Title"
										minLength={2}
										maxLength={48}
										isRequired={true}
										errors={errors2}
										defaultValue={admin.title}
									/>
								</div>

								<div className="mt-6">
									<Button
										state={
											changeProfileMutation.isLoading
												? "loading"
												: "default"
										}
										styleType="black"
										size="base"
										children="Update"
										type="submit"
									/>
								</div>
							</fieldset>
						</form>
					</div>
				</div>
				{/* ### disable account ### */}
				<div className="border-t grid grid-cols-2 gap-6 my-8 pt-2">
					<div>
						<h3 className="text-md font-medium text-gray-800 my-4">
							Disable Account
						</h3>
						<p className="text-bb text-gray-500">
							Account can be enabled at a later date if required. Accounts
							cannot be deleted.
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
						{admin.active ? (
							<>
								<p className="text-gray-700 text-bb mb-4">
									Account is enabled.
								</p>
								<Button
									state={
										disableAdminMutation.isLoading
											? "loading"
											: disableAdminMutation.isSuccess
											? "done"
											: "default"
									}
									styleType="danger"
									size="base"
									outline={true}
									type="button"
									children="DISABLE ACCOUNT"
									onClick={() => {
										disableAdminMutation.mutate();
									}}
									disabled={admin.username === "root"}
								/>
							</>
						) : (
							<>
								<p className="text-red-700 text-bb font-medium mb-4">
									Account is disabled.
								</p>
								<Button
									state={
										enableAdminMutation.isLoading
											? "loading"
											: enableAdminMutation.isSuccess
											? "done"
											: "default"
									}
									styleType="primary"
									size="base"
									outline={true}
									type="button"
									children="Enable"
									onClick={() => {
										enableAdminMutation.mutate();
									}}
									disabled={admin.username === "root"}
								/>
							</>
						)}
						{admin.username === "root" && (
							<p className="my-2 text-gray-600 text-sm">
								Root account cannot be disabled.
							</p>
						)}
					</div>
				</div>
				{/* profile information */}
				<div className="border-t my-8 pt-2">
					<h3 className="text-md font-medium text-gray-800 mb-4 my-4">
						Information
					</h3>
					<table className="text-gray-600 text-bb">
						<tbody>
							<tr>
								<td className="font-medium w-1/2 pb-1">Added on</td>
								<td>{dateTimePretty(admin.created_at)}</td>
							</tr>
							<tr>
								<td className="font-medium w-1/2 py-1">Added by</td>
								<td>{admin.created_by}</td>
							</tr>
							<tr>
								<td className="font-medium w-1/2 py-1">Updated</td>
								<td>{timeSince(admin.updated_at)}</td>
							</tr>
							<tr>
								<td className="font-medium w-1/2 pt-1">Updated by</td>
								<td>{admin.updated_by}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</>
	) : adminQuery.isLoading ? (
		<div className="h-full flex place-items-center justify-center">
			<Spinner color="accent" size="xl" />
		</div>
	) : (
		<></>
	);
}
