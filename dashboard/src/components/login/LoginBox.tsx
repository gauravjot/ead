import {doLogin} from "@/services/auth/login";
import React, {Dispatch, SetStateAction} from "react";
import {useMutation} from "react-query";
import {AxiosError} from "axios";
import {ErrorType} from "@/types/api";
import ServerSetup from "@/components/login/ServerSetup";
import Button from "../ui/Button";
import {LoggedInAdminType} from "@/types/admin";

export default function LoginBox({
	setAdmin,
}: {
	setAdmin: Dispatch<SetStateAction<LoggedInAdminType | null>>;
}) {
	const [username, setUsername] = React.useState<string>("");
	const [password, setPassword] = React.useState<string>("");
	const [error, setError] = React.useState<string>("");
	const [newServerSetup, setNewServerSetup] = React.useState<boolean>(false);

	const mutation = useMutation({
		mutationFn: () => {
			return doLogin(username, password);
		},
		onSuccess: (data) => {
			setAdmin(data);
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

	function login() {
		mutation.mutate();
	}

	return (
		<div className="relative">
			<div className="rounded-md px-12 pb-20 pt-14 shadow-lg relative overflow-hidden bg-black z-10">
				<div className="absolute inset-0 moving-bg z-20"></div>
				<div className="grid sm:grid-cols-2">
					<div>
						<h1 className="text-3xl sm:text-5xl font-bold text-white sm:pt-4">Login</h1>
					</div>
					<div>
						{error.length > 0 && (
							<p className="mt-5 text-red-100 bg-red-600/30 px-2 text-bb py-1 rounded">{error}</p>
						)}
						<form
							onSubmit={(e: React.FormEvent) => {
								e.preventDefault();
								if (username.length < 1 || password.length < 1) {
									setError("One or more fields are empty.");
								} else {
									login();
								}
							}}
						>
							<fieldset disabled={mutation.isLoading || mutation.isSuccess}>
								<label className="block text-white text-sm py-1.5 mt-4" htmlFor="username">
									Username
								</label>
								<input
									className={
										"block w-full bg-white/10 border border-white/30 text-white px-3 py-1.5 rounded focus-visible:outline-4 focus-visible:outline-white/20 focus-visible:outline focus-visible:border-gray-300" +
										(error.length > 0 && username.length < 1 ? " border-red-500/70" : "")
									}
									type="text"
									id="username"
									name="username"
									value={username}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										setUsername(e.target.value);
									}}
								/>
								<label className="block text-white text-sm py-1.5 mt-2" htmlFor="password">
									Password
								</label>
								<input
									className={
										"block w-full bg-white/10 border border-white/30 text-white px-3 py-1.5 rounded focus-visible:outline-4 focus-visible:outline-white/20 focus-visible:outline focus-visible:border-gray-300" +
										(error.length > 0 && password.length < 1 ? " border-red-500/70" : "")
									}
									type="password"
									id="password"
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
										elementStyle="white_opaque"
										elementSize="base"
										elementWidth="full"
										elementChildren="Continue"
										elementType="submit"
									/>
								</div>
							</fieldset>
						</form>
						<p className="mt-8 text-gray-200 text-[0.875rem]">
							If you forgot your credentials, please contact your administrator.
						</p>
						<p className="mt-3">
							<button
								className="text-white underline underline-offset-4 hover:underline-offset-[5px] transition-all text-sm"
								aria-expanded={newServerSetup}
								onClick={() => {
									setNewServerSetup(true);
								}}
							>
								Setup new server
							</button>
						</p>
					</div>
				</div>
			</div>
			<div aria-hidden={!newServerSetup} className="aria-hidable absolute inset-0">
				<div className="fixed inset-0 bg-black/10 z-10"></div>
				<div className="relative z-20">
					<button
						onClick={() => {
							setNewServerSetup(false);
						}}
						className="absolute top-0 right-0 hover:underline font-medium text-sm my-3 mx-4 p-2"
					>
						Close
					</button>
					<ServerSetup setAdmin={setAdmin} />
				</div>
			</div>
		</div>
	);
}
