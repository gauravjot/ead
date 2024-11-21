import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";
import {UserLoggedInType} from "@/types/user";

/**
 * API call to login
 * @param email
 * @param password
 * @returns Promise
 */
export async function doRegister(
	first_name: string,
	last_name: string,
	email: string,
	password: string,
): Promise<UserLoggedInType> {
	return axios.post(
		BACKEND_ENDPOINT + "/api/user/register/",
		JSON.stringify({
			first_name: first_name,
			last_name: last_name,
			email: email,
			password: password,
		}),
		{
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		},
	);
}
