import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";
import {UserType} from "@/types/user";

/**
 * API call to get user info
 * @param id
 * @returns Promise
 */
export function getUser(id: string) {
	return axios
		.get(BACKEND_ENDPOINT + "/api/user/" + id + "/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data.data as UserType;
		});
}
