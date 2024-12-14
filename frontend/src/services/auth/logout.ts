import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

export function doLogout() {
	return axios
		.post(
			BACKEND_ENDPOINT + "/api/user/logout/",
			{},
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
				withCredentials: true,
			}
		)
		.then(() => {
			return true;
		});
}
