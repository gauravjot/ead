import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";
import {UserLoggedInType} from "@/types/user";

/**
 * API call to login
 * @param email
 * @param password
 * @returns Promise
 */
export async function doLogin(email: string, password: string): Promise<UserLoggedInType> {
	return axios.post(
		BACKEND_ENDPOINT + "/api/user/login/",
		JSON.stringify({email: email, password: password}),
		{
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		},
	);
}
