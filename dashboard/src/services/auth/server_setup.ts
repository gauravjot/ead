import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

/**
 * API call to login
 * @param username
 * @param password
 * @returns Promise
 */
export function doServerSetup(password:string) {
	return axios
		.post(BACKEND_ENDPOINT + "/api/admin/setup/",
      JSON.stringify({ password: password }),
      {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((res) => {
			return res.data;
		});
}
