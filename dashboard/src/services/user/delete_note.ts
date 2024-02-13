import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to delete item type fields
 * @param token
 * @param nid Note ID
 * @param uid User ID
 * @returns Promise
 */
export function deleteNote(token: string | undefined | null, payload: {nid: number; uid: string}) {
	return token
		? axios
				.delete(BACKEND_ENDPOINT + `/api/user/${payload.uid}/note/${payload.nid}/`, {
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
