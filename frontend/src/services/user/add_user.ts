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
 * @param payload: AddUserType
 * @returns Promise
 */
export function addUser(payload: AddUserType) {
	return axios
		.post(BACKEND_ENDPOINT + "/api/user/new/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data;
		});
}
