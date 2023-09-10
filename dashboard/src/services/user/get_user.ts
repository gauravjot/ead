import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

/**
 * API call to get user info
 * @param token
 * @param id
 * @returns Promise
 */
export function getUser(token: string | undefined | null, id: string) {
	return token
		? axios
				.get(BACKEND_ENDPOINT + "/api/user/info/" + id + "/", {
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
