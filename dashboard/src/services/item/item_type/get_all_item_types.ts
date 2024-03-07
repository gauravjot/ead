import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to get all item types
 * @returns Promise
 */
export function getAllItemTypes() {
	return axios
		.get(BACKEND_ENDPOINT + "/api/item/type/all/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data;
		});
}
