import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

/**
 * API call to change profile data
 * @param token
 * @param username
 * @param title
 * @param full_name
 * @returns Promise
 */
export function changeProfile(
	token: string | undefined | null,
	username: string,
	title: string,
	full_name: string
) {
	return token
		? axios
				.put(
					BACKEND_ENDPOINT + "/api/admin/changeprofile/",
					JSON.stringify({
						username: username,
						title: title,
						full_name: full_name,
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
