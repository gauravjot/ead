import { InputHTMLAttributes } from "react";
import { FieldErrors, FieldValues, UseFormRegister, UseFormWatch } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	id: string;
	label: string;
	inputType: "text" | "number" | "password" | "email";
	register: UseFormRegister<FieldValues>;
	isRequired?: boolean;
	minLength?: number;
	maxLength?: number;
	errors?: FieldErrors<FieldValues>;
	watch?: UseFormWatch<FieldValues>;
	watchField?: string;
	width?: "auto" | "full";
}
type ValidationType = {
	required?: string;
	minLength?: { value: number; message: string };
	maxLength?: { value: number; message: string };
	validate?: (val: string) => string | undefined;
};
export default function InputField({
	errors,
	id,
	inputType,
	label,
	register,
	minLength,
	isRequired,
	maxLength,
	watch,
	watchField,
	width,
	...rest
}: InputProps) {
	const validation: ValidationType = {};
	if (isRequired) {
		validation["required"] = "This field is required.";
	}
	if (minLength) {
		validation["minLength"] = {
			value: minLength,
			message: "Value should be atleast of length " + minLength + ".",
		};
	}
	if (maxLength) {
		validation["maxLength"] = {
			value: maxLength,
			message: "Maximum value length should be " + maxLength + ".",
		};
	}
	if (watch && watchField) {
		validation["validate"] = (val: string) => {
			if (watch(watchField) != val) {
				return "Your passwords do no match";
			}
		};
	}

	return (
		<div className="my-2 mx-px">
			<label className="block text-gray-600 text-sm py-1.5" htmlFor={id}>
				{label}{" "}
				{validation.required && <span className="text-red-500 font-bold">*</span>}
			</label>
			<input
				aria-invalid={errors && errors[id] ? "true" : "false"}
				className={
					"block border px-3 py-1.5 rounded-md focus-visible:outline-3" +
					" focus-visible:outline-dodger-200 focus-visible:outline focus-visible:border-dodger-500" +
					" transition:all disabled:bg-blue-50 disabled:text-gray-500" +
					(errors && errors[id]
						? " border-red-700 bg-red-50"
						: " border-gray-300 bg-white") +
					(width && width === "full" ? " w-full" : " w-full max-w-[20rem]")
				}
				type={inputType}
				id={id}
				{...register(id, validation)}
				{...rest}
			/>
			{errors && errors[id] && (
				<p className="text-red-700 text-bb my-1">
					{errors[id]?.message?.toString()}
				</p>
			)}
		</div>
	);
}
