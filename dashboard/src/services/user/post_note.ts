import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to add user note
 * @param token
 * @returns Promise
 */
export function postNoteToUser(
	token: string | undefined | null,
	payload: {content: string; uid: string}
) {
	return token
		? axios
				.post(BACKEND_ENDPOINT + "/api/user/note/post/", JSON.stringify(payload), {
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
