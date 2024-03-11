import {doLogin} from "@/services/auth/login";
import React, {useContext, useEffect} from "react";
import {useMutation} from "react-query";
import {AxiosError} from "axios";
import {ErrorType} from "@/types/api";
import Button from "@/components/ui/Button";
import {AdminContext} from "@/App";
import {doServerSetup} from "@/services/auth/server_setup";
import {useNavigate} from "react-router-dom";

export default function LoginPage() {
	const navigate = useNavigate();
	const adminContext = useContext(AdminContext);

	const [username, setUsername] = React.useState<string>("");
	const [password, setPassword] = React.useState<string>("");
	const [error, setError] = React.useState<string>("");
	const [newServerSetup, setNewServerSetup] = React.useState<boolean>(false);

	useEffect(() => {
		if (adminContext.admin) {
			navigate("/admins");
		}
	}, [adminContext, navigate]);

	const mutation = useMutation({
		mutationFn: () => {
			return doLogin(username, password);
		},
		onSuccess: (data) => {
			adminContext.setAdmin(data);
			navigate("/admins");
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

	return adminContext.admin ? (
		<></>
	) : (
		<div className="container max-w-5xl px-4 mx-auto py-6">
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
						<ServerSetup />
					</div>
				</div>
			</div>
		</div>
	);
}

export function ServerSetup() {
	const adminContext = useContext(AdminContext);

	const [password, setPassword] = React.useState<string>("");
	const [error, setError] = React.useState<string>("");

	const mutation = useMutation({
		mutationFn: () => {
			return doServerSetup(password);
		},
		onSuccess: (data) => {
			adminContext.setAdmin(data);
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
