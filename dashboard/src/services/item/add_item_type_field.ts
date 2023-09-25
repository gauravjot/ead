import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

/**
 * API call to change password
 * @param token
 * @param id
 * @param fields
 * @returns Promise
 */
export function addItemTypeFields(
	token: string | undefined | null,
	id: string | number,
	fields: string
) {
	return token
		? axios
				.post(
					BACKEND_ENDPOINT + `/api/item/type/${id}/add/`,
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
