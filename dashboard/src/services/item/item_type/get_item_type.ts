import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to get item type
 * @param id
 * @returns Promise
 */
export function getItemType(id: string | number) {
	return axios
		.get(BACKEND_ENDPOINT + "/api/item/type/" + id + "/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data;
		});
}
