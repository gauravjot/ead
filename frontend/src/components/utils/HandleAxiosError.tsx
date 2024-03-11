import {ErrorType} from "@/types/api";
import {AxiosError} from "axios";
import {Dispatch, SetStateAction} from "react";

export function handleAxiosError(
	error: AxiosError,
	setReqError: Dispatch<SetStateAction<string | null>>
) {
	const msg = error.response?.data;
	try {
		const res = msg as ErrorType;
		setReqError(res.message);
	} catch (err) {
		setReqError(error.message);
	}
}
