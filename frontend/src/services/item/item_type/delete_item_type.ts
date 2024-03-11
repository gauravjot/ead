import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to delete item type
 * @param id
 * @returns Promise
 */
export function deleteItemType(id: number | string) {
	return axios
		.delete(BACKEND_ENDPOINT + `/api/item/type/${id}/delete/`, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data;
		});
}
