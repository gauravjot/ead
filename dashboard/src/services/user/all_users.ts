import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to get all users
 * @param token
 * @returns Promise
 */
export function getAllUsers(token: string | undefined | null) {
	return token
		? axios
				.get(BACKEND_ENDPOINT + "/api/user/all/", {
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
