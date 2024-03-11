import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to get items for item type
 * @param id
 * @returns Promise
 */
export function getItems(id: string | number) {
	return axios
		.get(BACKEND_ENDPOINT + "/api/item/type/" + id + "/items/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data;
		});
}
