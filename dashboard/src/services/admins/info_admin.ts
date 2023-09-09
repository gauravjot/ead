import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

/**
 * API call to get admin info
 * @param token
 * @param username
 * @returns Promise
 */
export function getAdmin(token: string | undefined | null, username: string) {
	return token
		? axios
				.get(BACKEND_ENDPOINT + "/api/admin/info/" + username + "/", {
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				})
				.then((res) => {
					return res.data;
				})
		: Promise.reject();
}
