import {useForm} from "react-hook-form";
import InputField from "@/components/ui/InputField";
import {useMutation, useQueryClient} from "react-query";
import {AxiosError} from "axios";
import {handleAxiosError} from "@/components/utils/HandleAxiosError";
import Button from "@/components/ui/Button";
import {ClientType} from "@/types/client";
import {AdminType} from "@/types/admin";
import {useState} from "react";
import {dateTimePretty} from "@/utils/datetime";
import {updateClient} from "@/services/invoice/client/update_client";
import {DualColumnTable} from "@/components/ui/table/DualColumnDetailTable";
import {updateClientAddress} from "@/services/invoice/client/update_client_address";
import {deleteClient} from "@/services/invoice/client/delete_client";

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
		mutationFn: (d: {type: string; name: string; email: string; phone: string; vat: string}) => {
			return props.client
				? updateClient(props.admin?.token, props.client?.id, d)
				: Promise.reject();
		},
		onSuccess: () => {
			setChangeProfileReqError(null);
			reset2();
			queryClient.invalidateQueries(["client_" + props.client?.id]);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setChangeProfileReqError);
		},
	});

	const [deleteCheckbox, setDeleteCheckbox] = useState<boolean>(false);
	const [deleteItemTypeReqError, setDeleteItemTypeReqError] = useState<string | null>(null);
	const deleteItemTypeMutation = useMutation({
		mutationFn: () => {
			return props.admin && props.client?.id
				? deleteClient(props.admin?.token, props.client?.id)
				: Promise.reject();
		},
		onSuccess: () => {
			queryClient.resetQueries(["client_" + props.client?.id]);
			queryClient.resetQueries(["client_list"]);
			setDeleteItemTypeReqError(null);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setDeleteItemTypeReqError);
		},
	});

	return (
		props.client && (
			<div className="mx-8 max-w-[1400px]">
				{/* profile information */}
				<h3 className="text-md font-medium text-gray-800 mb-4 mt-8">Client Information</h3>
				<DualColumnTable
					left={[
						{title: "Business name", value: props.client.name},
						{title: "Business type", value: props.client.type},
						{title: "Email", value: props.client.email},
						{title: "Phone", value: props.client.phone},
						{title: "Client ID", value: props.client.id},
						{title: "Last Updated", value: dateTimePretty(props.client.updated_at)},
						{title: "Updated by", value: props.client.updated_by},
					]}
					right={[
						{title: "Street", value: props.client.street},
						{title: "City", value: props.client.city},
						{title: "State/Province", value: props.client.province},
						{title: "Country", value: props.client.country},
						{title: "Zip", value: props.client.postal_code},
						{title: "Added on", value: dateTimePretty(props.client.created_at)},
						{title: "Added by", value: props.client.created_by},
					]}
				/>
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
									<InputField
										elementId="vat"
										elementInputType="text"
										elementHookFormRegister={register2}
										elementLabel="VAT Number"
										elementInputMinLength={0}
										elementInputMaxLength={16}
										elementHookFormErrors={errors2}
										defaultValue={props.client.vat}
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
				{props.admin?.token && props.client && (
					<UpdateAddress token={props.admin.token} client={props.client} />
				)}
				<div className="border-t grid grid-cols-2 gap-6 my-8 pt-2">
					<div>
						<h3 className="text-md font-medium text-gray-800 my-4">Delete Client</h3>
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

function UpdateAddress({token, client}: {token: string; client: ClientType}) {
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
		mutationFn: (d: {
			street: string;
			city: string;
			province: string;
			country: string;
			postal_code: string;
		}) => {
			return updateClientAddress(token, client.id, d);
		},
		onSuccess: () => {
			setChangeProfileReqError(null);
			reset2();
			queryClient.invalidateQueries(["client_" + client.id]);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setChangeProfileReqError);
		},
	});
	return (
		<div className="border-t grid grid-cols-2 gap-6 my-8 pt-2">
			<div>
				<h3 className="text-md font-medium text-gray-800 my-4">Update Address</h3>
				<p className="text-bb text-gray-500">Make changes to client address.</p>
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
					key={client.id + 2}
					onSubmit={handleSubmit2((d) => {
						changeProfileMutation.mutate(JSON.parse(JSON.stringify(d)));
					})}
				>
					<fieldset>
						<div>
							<InputField
								elementId="street"
								elementInputType="text"
								elementHookFormRegister={register2}
								elementLabel="Street"
								elementInputMinLength={0}
								elementInputMaxLength={128}
								elementIsRequired={false}
								elementHookFormErrors={errors2}
								defaultValue={client.street}
							/>
							<InputField
								elementId="city"
								elementInputType="text"
								elementHookFormRegister={register2}
								elementLabel="City"
								elementInputMinLength={0}
								elementInputMaxLength={128}
								elementIsRequired={false}
								elementHookFormErrors={errors2}
								defaultValue={client.city}
							/>
							<InputField
								elementId="province"
								elementInputType="text"
								elementHookFormRegister={register2}
								elementLabel="Province/State"
								elementInputMinLength={0}
								elementInputMaxLength={128}
								elementIsRequired={false}
								elementHookFormErrors={errors2}
								defaultValue={client.province}
							/>
							<InputField
								elementId="postal_code"
								elementInputType="text"
								elementHookFormRegister={register2}
								elementLabel="Postal Code/ZIP"
								elementInputMinLength={0}
								elementInputMaxLength={16}
								elementIsRequired={false}
								elementHookFormErrors={errors2}
								defaultValue={client.postal_code}
							/>
							<InputField
								elementId="country"
								elementInputType="text"
								elementHookFormRegister={register2}
								elementLabel="Country"
								elementInputMinLength={0}
								elementInputMaxLength={128}
								elementIsRequired={false}
								elementHookFormErrors={errors2}
								defaultValue={client.country}
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
	);
}
