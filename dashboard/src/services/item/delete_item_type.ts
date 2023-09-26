import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

/**
 * API call to delete item type
 * @param token
 * @param id
 * @returns Promise
 */
export function deleteItemType(token: string | undefined | null, id: number | string) {
	return token
		? axios
				.delete(
					BACKEND_ENDPOINT + `/api/item/type/${id}/`,
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
