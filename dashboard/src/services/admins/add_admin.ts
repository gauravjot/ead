import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

export type AddAdminType = {
	username: string;
	password: string;
	full_name: string;
	title: string;
	confirm_password?: string;
};

/**
 * API call to add admins
 * @param token
 * @returns Promise
 */
export function addAdmin(token: string | undefined | null, payload: AddAdminType) {
	return token
		? axios
				.post(
					BACKEND_ENDPOINT + "/api/admin/register/",
					JSON.stringify(payload),
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: token,
						},
					}
				)
				.then((res) => {
					return res.data;
				})
		: Promise.reject();
}
