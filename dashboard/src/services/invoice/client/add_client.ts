import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

export type AddClientType = {
	name: string;
	email: string;
	phone: string;
	title: string;
};

/**
 * API call to add user
 * @param token
 * @returns Promise
 */
export function addClient(token: string | undefined | null, payload: AddClientType) {
	return token
		? axios
				.post(BACKEND_ENDPOINT + "/api/invoice/client/add/", JSON.stringify(payload), {
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
