import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

/**
 * API call to delete item type fields
 * @param token
 * @param id
 * @param fields
 * @returns Promise
 */
export function deleteItem(
	token: string | undefined | null,
	id: string | number
) {
	return token
		? axios
				.delete(
					BACKEND_ENDPOINT + `/api/item/${id}/delete/`,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: token,
						},
					}
				)
				.then((res) => {
					return res.data;
				})
		: Promise.reject();
}
