import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to add user note
 * @returns Promise
 */
export function postNote(payload: {content: string; uid: string}) {
	return axios
		.post(
			BACKEND_ENDPOINT + "/api/user/" + payload.uid + "/note/new/",
			JSON.stringify({content: payload.content}),
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
