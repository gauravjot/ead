import axios from "axios";
import {BACKEND_ENDPOINT} from "@/config";
import {LogType} from "@/types/log";

/**
 * API call to get logs that are actioned to an admin
 * @param username
 * @returns Promise
 */
export function getAdminLogs(username: string | undefined) {
	return username
		? axios
				.get(BACKEND_ENDPOINT + "/api/admin/logs/for/" + username + "/", {
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				})
				.then((res) => {
					return res.data as LogType[];
				})
		: Promise.reject("Username is not provided");
}

/**
 * API call to get logs that are actioned by an admin
 * @param username
 * @returns Promise
 */
export function getAdminActionLogs(username: string | undefined) {
	return username
		? axios
				.get(BACKEND_ENDPOINT + "/api/admin/logs/by/" + username + "/", {
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				})
				.then((res) => {
					return res.data as LogType[];
				})
		: Promise.reject("Username is not provided");
}
