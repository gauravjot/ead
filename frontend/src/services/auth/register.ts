import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";
import {UserLoggedInType} from "@/types/user";

export interface RegistrationDataType {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
}

/**
 * API call to login
 * @param email
 * @param password
 * @returns Promise
 */
export async function doRegister(data: RegistrationDataType): Promise<UserLoggedInType> {
	return axios.post(
		BACKEND_ENDPOINT + "/api/user/register/",
		JSON.stringify({
			first_name: data.first_name,
			last_name: data.last_name,
			email: data.email,
			password: data.password,
		}),
		{
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		}
	);
}
