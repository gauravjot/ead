import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

/**
 * API call to change password
 * @param token
 * @param username
 * @param password
 * @returns Promise
 */
export function changePassword(
	token: string | undefined | null,
	username: string,
	password: string
) {
	return token
		? axios
				.put(
					BACKEND_ENDPOINT + "/api/admin/changepswd/",
					JSON.stringify({ username: username, password: password }),
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
