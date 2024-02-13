import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to add user note
 * @param token
 * @returns Promise
 */
export function postNote(
	token: string | undefined | null,
	payload: {content: string; uid: string}
) {
	return token
		? axios
				.post(
					BACKEND_ENDPOINT + "/api/user/" + payload.uid + "/note/new/",
					JSON.stringify({content: payload.content}),
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
