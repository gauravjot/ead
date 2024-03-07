import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to delete item type fields
 * @param id
 * @param fields
 * @returns Promise
 */
export function deleteItemTypeFields(id: string | number, fields: string) {
	return axios
		.put(
			BACKEND_ENDPOINT + `/api/item/type/${id}/template_fields/delete/`,
			JSON.stringify({fields: fields}),
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		)
		.then((res) => {
			return res.data;
		});
}
