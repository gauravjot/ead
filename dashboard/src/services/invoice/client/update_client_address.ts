import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

/**
 * API call to change profile data
 * @param token
 * @param id
 * @param street
 * @param city
 * @param province
 * @param postal_code
 * @param country
 * @returns Promise
 */
export function updateClientAddress(
	token: string | undefined | null,
	id: string,
	data: {
		street: string;
		city: string;
		province: string;
		postal_code: string;
		country: string;
	}
) {
	return token
		? axios
				.put(
					BACKEND_ENDPOINT + "/api/invoice/client/update_address/",
					JSON.stringify({
						uid: id,
						street: data.street,
						city: data.city,
						province: data.province,
						postal_code: data.postal_code,
						country: data.country,
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
