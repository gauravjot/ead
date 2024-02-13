import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";
import {NoteType} from "@/types/user";

/**
 * API call to get all users
 * @param token
 * @returns Promise
 */
export function getUserNotes(token: string | undefined | null, id: string | undefined | null) {
	return token && id
		? axios
				.get(BACKEND_ENDPOINT + `/api/user/${id}/note/all/`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
					},
				})
				.then((res) => {
					return res.data.data as NoteType[];
				})
		: Promise.reject();
}
