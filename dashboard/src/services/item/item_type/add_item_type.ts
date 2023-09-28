import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

export type AddItemTypeType = {
	name: string;
	description: string;
	template: string;
};

/**
 * API call to add item type
 * @param token: string
 * @param payload: AddItemTypeType
 * @returns Promise
 */
export function addItemType(token: string | undefined | null, payload: AddItemTypeType) {
	return token
		? axios
				.post(BACKEND_ENDPOINT + "/api/item/type/add/", JSON.stringify(payload), {
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				})
				.then((res) => {
					return res.data;
				})
		: Promise.reject();
}
