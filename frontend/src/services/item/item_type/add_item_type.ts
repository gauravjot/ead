import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

export type AddItemTypeType = {
	name: string;
	description: string;
	template: string;
};

/**
 * API call to add item type
 * @param payload: AddItemTypeType
 * @returns Promise
 */
export function addItemType(payload: AddItemTypeType) {
	return axios
		.post(BACKEND_ENDPOINT + "/api/item/type/add/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data;
		});
}
