import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

export type AddItemType = {
	name: string;
	description: string;
	value: string;
};

/**
 * API call to add item
 * @param token
 * @param AddItemType
 * @returns Promise
 */
export function addItem(token: string | undefined | null, payload: AddItemType) {
	return token
		? axios
				.post(
					BACKEND_ENDPOINT + "/api/item/add/",
					JSON.stringify(payload),
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
