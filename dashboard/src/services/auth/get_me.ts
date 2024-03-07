import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";
import {LoggedInAdminType} from "@/types/admin";

/**
 * API call to get logged in admin profile
 * @returns Promise
 */
export function getLoggedInAdmin() {
	return axios
		.get(BACKEND_ENDPOINT + "/api/admin/me/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data.data as LoggedInAdminType;
		});
}
