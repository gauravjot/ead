import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

export type AddAdminType = {
	username: string;
	password: string;
	full_name: string;
	email: string;
	phone: string;
	title: string;
	connect_to?: number;
};

/**
 * API call to add admins
 * @returns Promise
 */
export function addAdmin(payload: AddAdminType) {
	return axios
		.post(BACKEND_ENDPOINT + "/api/admin/register/", JSON.stringify(payload), {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data;
		});
}
