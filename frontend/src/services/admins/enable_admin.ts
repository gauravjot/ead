import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to enable admin
 * @param username
 * @returns Promise
 */
export function enableAdmin(username: string) {
	return axios
		.put(
			BACKEND_ENDPOINT + "/api/admin/enable/",
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
