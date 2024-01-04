import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to delete item type fields
 * @param token
 * @param nid Note ID
 * @param uid User ID
 * @returns Promise
 */
export function deleteClientNote(
	token: string | undefined | null,
	payload: {nid: number; uid: string}
) {
	return token
		? axios
				.put(
					BACKEND_ENDPOINT + `/api/invoice/client/note/delete/`,
					JSON.stringify({
						uid: payload.uid,
						nid: payload.nid,
					}),
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: token,
						},
					}
				)
				.then((res) => {
					return res.data;
				})
		: Promise.reject();
}
