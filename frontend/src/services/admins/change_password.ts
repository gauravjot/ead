import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to change password
 * @param username
 * @param password
 * @returns Promise
 */
export function changePassword(username: string, password: string) {
	return axios
		.put(
			BACKEND_ENDPOINT + "/api/admin/changepswd/",
			JSON.stringify({username: username, password: password}),
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
