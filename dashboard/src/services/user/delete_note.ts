import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to delete user note
 * @param payload {nid: number; uid: string}
 * @returns Promise
 */
export function deleteNote(payload: {nid: number; uid: string}) {
	return axios
		.delete(BACKEND_ENDPOINT + `/api/user/${payload.uid}/note/${payload.nid}/`, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data;
		});
}
