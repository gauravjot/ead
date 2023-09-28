import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

/**
 * API call to get items for item type
 * @param token
 * @param id
 * @returns Promise
 */
export function getItems(token: string | undefined | null, id: string | number) {
	return token
		? axios
				.get(BACKEND_ENDPOINT + "/api/item/type/" + id + "/items/", {
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
