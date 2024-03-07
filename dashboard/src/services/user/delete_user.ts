import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to delete user
 * @param id
 * @returns Promise
 */
export function deleteUser(id: string | number) {
	return axios
		.delete(BACKEND_ENDPOINT + `/api/user/${id}/`, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data;
		});
}
