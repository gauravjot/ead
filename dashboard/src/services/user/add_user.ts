import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

export type AddUserType = {
	name: string;
	email: string;
	phone: string;
	role: string;
};

/**
 * API call to add user
 * @param token
 * @returns Promise
 */
export function addUser(token: string | undefined | null, payload: AddUserType) {
	return token
		? axios
				.post(BACKEND_ENDPOINT + "/api/user/new/", JSON.stringify(payload), {
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				})
				.then((res) => {
					return res.data;
				})
		: Promise.reject();
}
