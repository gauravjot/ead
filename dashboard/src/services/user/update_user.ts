import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

export interface UpdateUserType {
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
 * @param UpdateUserType {id: string, d: {name: string, role: string, email: string, phone: string}}
 * @returns Promise
 */
export function updateUser(props: UpdateUserType) {
	return axios
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
				},
				withCredentials: true,
			}
		)
		.then((res) => {
			return res.data;
		});
}
