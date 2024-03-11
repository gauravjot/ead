import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to get all users
 * @returns Promise
 */
export function getAllUsers() {
	return axios
		.get(BACKEND_ENDPOINT + "/api/user/all/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data;
		});
}
