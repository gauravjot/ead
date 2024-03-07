import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to get all admins
 * @returns Promise
 */
export function getAllAdmins() {
	return axios
		.get(BACKEND_ENDPOINT + "/api/admin/all/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data;
		});
}
