import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to get item
 * @param id
 * @returns Promise
 */
export function getItem(id: string | number) {
	return axios
		.get(BACKEND_ENDPOINT + "/api/item/" + id + "/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data;
		});
}
