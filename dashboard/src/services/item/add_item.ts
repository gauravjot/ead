import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

export type AddItemType = {
	name: string;
	description: string;
	value: string;
};

/**
 * API call to add item
 * @param AddItemType
 * @returns Promise
 */
export function addItem(payload: AddItemType) {
	return axios
		.post(BACKEND_ENDPOINT + "/api/item/add/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data;
		});
}
