import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

/**
 * API call to change profile data
 * @param token
 * @param id
 * @param name
 * @param description
 * @returns Promise
 */
export function editItemType(
	token: string | undefined | null,
	id: string | number,
	name: string,
	description: string
) {
	return token
		? axios
				.put(
					BACKEND_ENDPOINT + `/api/item/type/${id}/`,
					JSON.stringify({
						name: name,
						description: description
					}),
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
