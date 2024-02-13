import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to change profile data
 * @param token
 * @param nid Note ID
 * @param content New note content
 * @param uid User ID
 * @returns Promise
 */
export function updateNote(
	token: string | undefined | null,
	payload: {
		nid: number;
		content: string;
		uid: string;
	}
) {
	return token
		? axios
				.put(
					BACKEND_ENDPOINT + `/api/user/${payload.uid}/note/${payload.nid}/`,
					JSON.stringify({
						content: payload.content,
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
