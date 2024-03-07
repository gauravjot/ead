import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to get admin info
 * @param username
 * @returns Promise
 */
export function getAdmin(username: string) {
	return axios
		.get(BACKEND_ENDPOINT + "/api/admin/info/" + username + "/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data;
		});
}
