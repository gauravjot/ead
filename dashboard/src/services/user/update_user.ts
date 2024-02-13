import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

export interface UpdateUserType {
	token: string | undefined | null;
	id: string;
	d: {
		name: string;
		role: string;
		email: string;
		phone: string;
	};
}

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
export function updateUser(props: UpdateUserType) {
	return props.token
		? axios
				.put(
					BACKEND_ENDPOINT + "/api/user/" + props.id + "/",
					JSON.stringify({
						uid: props.id,
						name: props.d.name,
						role: props.d.role,
						email: props.d.email,
						phone: props.d.phone,
					}),
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: props.token,
						},
					}
				)
				.then((res) => {
					return res.data;
				})
		: Promise.reject();
}
