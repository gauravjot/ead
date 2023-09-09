import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

/**
 * API call to enable admin
 * @param token
 * @param username
 * @returns Promise
 */
export function enableAdmin(token: string | undefined | null, username: string) {
	return token
		? axios
				.put(
					BACKEND_ENDPOINT + "/api/admin/enable/",
					JSON.stringify({
						username: username,
					}),
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
