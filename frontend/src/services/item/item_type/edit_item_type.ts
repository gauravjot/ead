import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to change profile data
 * @param id
 * @param name
 * @param description
 * @returns Promise
 */
export function editItemType(id: string | number, name: string, description: string) {
	return axios
		.put(
			BACKEND_ENDPOINT + `/api/item/type/${id}/edit/`,
			JSON.stringify({
				name: name,
				description: description,
			}),
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
