import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to disable admin
 * @param username
 * @returns Promise
 */
export function disableAdmin(username: string) {
	return axios
		.put(
			BACKEND_ENDPOINT + "/api/admin/disable/",
			JSON.stringify({
				username: username,
			}),
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		)
		.then((res) => {
			return res.data;
		});
}
