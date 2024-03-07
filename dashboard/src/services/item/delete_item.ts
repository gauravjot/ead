import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to delete item
 * @param id
 * @returns Promise
 */
export function deleteItem(id: string | number) {
	return axios
		.delete(BACKEND_ENDPOINT + `/api/item/${id}/delete/`, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((res) => {
			return res.data;
		});
}
