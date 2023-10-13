import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

/**
 * API call to get item
 * @param token
 * @param id
 * @returns Promise
 */
export function getItem(token: string | undefined | null, id: string | number) {
	return token
		? axios
				.get(BACKEND_ENDPOINT + "/api/item/" + id + "/", {
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
