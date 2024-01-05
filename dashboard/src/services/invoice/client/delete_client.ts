import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to delete client
 * @param token
 * @param id
 * @returns Promise
 */
export function deleteClient(token: string | undefined | null, id: string | number) {
	return token
		? axios
				.delete(BACKEND_ENDPOINT + `/api/invoice/client/${id}/delete/`, {
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
