import {doServerSetup} from "@/services/auth/server_setup";
import React, {Dispatch, SetStateAction} from "react";
import {useMutation} from "react-query";
import {AxiosError} from "axios";
import {ErrorType} from "@/types/api";
import Button from "../ui/Button";
import {AdminType} from "@/types/admin";

export default function ServerSetup({
	setAdmin,
}: {
	setAdmin: Dispatch<SetStateAction<AdminType | null>>;
}) {
	const [password, setPassword] = React.useState<string>("");
	const [error, setError] = React.useState<string>("");

	const mutation = useMutation({
		mutationFn: () => {
			return doServerSetup(password);
		},
		onSuccess: (data) => {
			setAdmin({...data.data.admin, token: data.data.token});
		},
		onError: (error: AxiosError) => {
			if (error.response) {
				const res = error.response.data as ErrorType;
				setError(`${res.message} Error code ${res.code}.`);
			} else {
				setError("Error getting correct response from server.");
			}
		},
	});

	function setup() {
		mutation.mutate();
	}

	return (
		<div className="bg-white rounded-md px-12 py-24 shadow-lg grid grid-cols-2 gap-12">
			<div className="my-4">
				<h1 className="text-3xl font-bold tracking-tighter">Welcome</h1>
				<div className="text-gray-700 leading-6 mt-7">
					<span>Few things to note</span>
					<ul className="ml-4 block mt-3 list-disc text-bb">
						<li>
							The username for administrative account is <span className="italic">root</span> and
							cannot be changed.
						</li>
						<li className="my-2">You can change password of root account later.</li>
						<li>Root account cannot be disabled.</li>
					</ul>
				</div>
			</div>
			<div>
				{error.length > 0 && <p className="mt-5 text-red-700">{error}</p>}
				<form
					onSubmit={(e: React.FormEvent) => {
						e.preventDefault();
						if (password.length < 1) {
							setError("Please enter a strong password.");
						} else if (password.length < 8) {
							setError("Password needs to be atleast 8 characters.");
						} else {
							setup();
						}
					}}
				>
					<fieldset disabled={mutation.isLoading || mutation.isSuccess}>
						<label className="block text-gray-600 text-sm py-1.5 mt-4" htmlFor="username1">
							Username
						</label>
						<input
							className="block w-full border px-3 py-1.5 rounded focus-visible:outline-3 focus-visible:outline-gray-200 focus-visible:outline focus-visible:border-gray-300 disabled:bg-blue-50 disabled:text-gray-500"
							type="text"
							id="username1"
							name="username"
							value="root"
							disabled={true}
						/>
						<label className="block text-gray-600 text-sm py-1.5 mt-2" htmlFor="password1">
							Password
						</label>
						<input
							className={
								"block w-full border px-3 py-1.5 rounded focus-visible:outline-3 focus-visible:outline-gray-200 focus-visible:outline focus-visible:border-gray-300" +
								(error.length > 0 && password.length < 1 ? " border-red-500/70" : "")
							}
							type="password"
							id="password1"
							name="password"
							value={password}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setPassword(e.target.value);
							}}
						/>
						<div className="mt-6">
							<Button
								elementState={
									mutation.isLoading ? "loading" : mutation.isSuccess ? "done" : "default"
								}
								elementStyle="black"
								elementSize="base"
								elementWidth="full"
								elementChildren="Continue"
								elementType="submit"
							/>
						</div>
					</fieldset>
				</form>
			</div>
		</div>
	);
}
