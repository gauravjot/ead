import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to update note
 * @param payload {nid: number; content: string; uid: string}
 * @returns Promise
 */
export function updateNote(payload: {nid: number; content: string; uid: string}) {
	return axios
		.put(
			BACKEND_ENDPOINT + `/api/user/${payload.uid}/note/${payload.nid}/`,
			JSON.stringify({
				content: payload.content,
			}),
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		)
		.then((res) => {
			return res.data;
		});
}
