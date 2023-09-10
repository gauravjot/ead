import axios from "axios";
import { BACKEND_ENDPOINT } from "@/config";

/**
 * API call to change profile data
 * @param token
 * @param id
 * @param name
 * @param title
 * @param phone
 * @param email
 * @returns Promise
 */
export function updateUser(
	token: string | undefined | null,
	id: string,
	name: string,
	title: string,
	email: string,
	phone: string
) {
	return token
		? axios
				.put(
					BACKEND_ENDPOINT + "/api/user/update/",
					JSON.stringify({
						uid: id,
						name: name,
						title: title,
						email: email,
						phone: phone,
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
