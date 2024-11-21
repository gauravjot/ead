import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";
import {UserType} from "@/types/user";

/**
 * API call to get logged in admin profile
 * @returns Promise
 */
export async function getMe(): Promise<UserType> {
	return axios
		.get(BACKEND_ENDPOINT + "/api/user/me/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((response) => response.data.user);
}
