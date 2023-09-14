import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

/**
 * API call to get all item types
 * @param token
 * @returns Promise
 */
export function getAllItemTypes(token: string | undefined | null) {
	return token
		? axios
				.get(BACKEND_ENDPOINT + "/api/item/type/all/", {
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
