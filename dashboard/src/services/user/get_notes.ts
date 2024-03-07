import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";
import {NoteType} from "@/types/user";

/**
 * API call to get user notes
 * @param id string
 * @returns Promise
 */
export function getUserNotes(id: string | undefined | null) {
	return id
		? axios
				.get(BACKEND_ENDPOINT + `/api/user/${id}/note/all/`, {
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				})
				.then((res) => {
					return res.data.data as NoteType[];
				})
		: Promise.reject();
}
