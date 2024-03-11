import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";

export function doLogout() {
	return axios
		.delete(BACKEND_ENDPOINT + "/api/admin/logout/", {
			headers: {
				"Content-Type": "multipart/form-data",
			},
			withCredentials: true,
		})
		.then(() => {
			return true;
		});
}
