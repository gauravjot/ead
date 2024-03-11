import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";
import {LoggedInAdminType} from "@/types/admin";

/**
 * API call to login
 * @param username
 * @param password
 * @returns Promise
 */
export function doServerSetup(password: string) {
	return axios
		.post(BACKEND_ENDPOINT + "/api/admin/setup/", JSON.stringify({password: password}), {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data.data as LoggedInAdminType;
		});
}
