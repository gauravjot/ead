import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

/**
 * API call to delete item type fields
 * @param token
 * @param id
 * @param fields
 * @returns Promise
 */
export function deleteItemTypeFields(
	token: string | undefined | null,
	id: string | number,
	fields: string
) {
	return token
		? axios
				.put(
					BACKEND_ENDPOINT + `/api/item/type/${id}/template_fields/delete/`,
					JSON.stringify({ fields: fields }),
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
