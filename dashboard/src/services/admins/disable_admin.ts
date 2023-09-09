import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

/**
 * API call to disable admin
 * @param token
 * @param username
 * @returns Promise
 */
export function disableAdmin(token: string | undefined | null, username: string) {
	return token
		? axios
				.put(
					BACKEND_ENDPOINT + "/api/admin/disable/",
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
