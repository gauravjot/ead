import {InputHTMLAttributes, useState} from "react";
import {FieldErrors, FieldValues, UseFormRegister, UseFormWatch} from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	elementId: string;
	elementLabel: string;
	elementInputType: "text" | "number" | "password" | "email";
	elementHookFormRegister: UseFormRegister<FieldValues>;
	elementHookFormErrors?: FieldErrors<FieldValues>;
	elementHookFormWatch?: UseFormWatch<FieldValues>;
	elementHookFormWatchField?: string;
	elementInputDecimal?: boolean;
	elementInputBoxLabel?: string;
	elementIsRequired?: boolean;
	elementInputMinLength?: number;
	elementInputMaxLength?: number;
	elementIsPassword?: boolean;
	elementIsTextarea?: boolean;
	elementIsReadOnly?: boolean;
	elementIsTextareaExpandable?: boolean;
	elementTextareaRows?: number;
	elementWidth?: "auto" | "full";
}
type ValidationType = {
	required?: string;
	minLength?: {value: number; message: string};
	maxLength?: {value: number; message: string};
	validate?: {[key: string]: (val: string) => string | undefined};
};
export default function InputField({
	elementHookFormErrors: errors,
	elementId: id,
	elementWidth: width,
	elementInputType: inputType,
	elementLabel: label,
	elementIsPassword: isPassword,
	elementIsTextarea: isTextarea,
	elementInputDecimal: isDecimal,
	elementInputBoxLabel: inputBoxLabel,
	elementTextareaRows: textareaSize,
	elementHookFormRegister: register,
	elementInputMinLength: minLength,
	elementIsRequired: isRequired,
	elementInputMaxLength: maxLength,
	elementHookFormWatch: watch,
	elementIsReadOnly: isReadOnly,
	elementHookFormWatchField: watchField,
	elementIsTextareaExpandable: isTextareaExpandable,
	...rest
}: InputProps) {
	const [showPassword, setShowPassword] = useState(false);

	const validation: ValidationType = {};
	if (isRequired) {
		validation["required"] = "This field is required";
	}
	if (minLength) {
		validation["minLength"] = {
			value: minLength,
			message: "Value should have atleast " + minLength + " characters",
		};
	}
	if (maxLength) {
		validation["maxLength"] = {
			value: maxLength,
			message: "Value cannot be longer than " + maxLength + " characters",
		};
	}
	if (watch && watchField) {
		validation["validate"] = {
			checkSame: (val: string) => {
				if (watch(watchField) != val) {
					return "Your passwords do no match";
				}
			},
		};
	}
	if (isPassword) {
		validation["validate"] = {
			...validation["validate"],
			passwordComplexity: (val: string) => {
				if (
					isPassword &&
					!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#%^~,&$*<>?])/.test(val)
				) {
					return "Your password needs to have atleast one lowercase, one uppercase, one number and one special character (~!@#$%^&*<>?).";
				}
			},
		};
	}

	const styling =
		"block w-full border px-3 py-1.5 rounded-md focus-visible:outline" +
		" outline-primary-200 outline-[3px] focus-visible:border-primary-500" +
		" hover:outline transition:all disabled:bg-blue-50 disabled:text-gray-500" +
		(errors && errors[id]
			? " border-red-700 bg-red-50/30 focus-visible:bg-white"
			: " border-gray-300 bg-white");

	// Resize Textarea
	if (isTextarea && isTextareaExpandable && rest["defaultValue"]) {
		setTimeout(() => {
			const textarea = document.getElementById(id);
			textarea?.style.setProperty("height", "");
			textarea?.style.setProperty("height", textarea.scrollHeight + 5 + "px");
			textarea?.style.setProperty("max-height", (window.innerHeight * 2) / 3 + "px");
			textarea?.style.setProperty("overflow-y", "hidden");
		}, 100);
	}

	return (
		<div
			className={
				(isReadOnly ? "grid grid-cols-2 border-b border-gray-200 last:border-none py-1 " : "") +
				"my-2 mx-px"
			}
		>
			<label
				className={(isReadOnly ? "" : "py-1.5 ") + "block text-gray-600 text-sm max-w-[20rem]"}
				htmlFor={id}
			>
				{label}{" "}
				{validation.required && (
					<span className="text-red-500 font-bold" title="Required">
						*
					</span>
				)}
			</label>
			<div
				className={"relative " + (width && width === "full" ? " w-full" : " w-full max-w-[20rem]")}
			>
				{isReadOnly ? (
					<p>{rest["defaultValue"]}</p>
				) : isTextarea ? (
					<textarea
						className={styling}
						aria-invalid={errors && errors[id] ? "true" : "false"}
						rows={textareaSize || 2}
						id={id}
						{...register(id, validation)}
						defaultValue={rest["defaultValue"]}
						onInput={(e) => {
							if (isTextareaExpandable) {
								e.currentTarget.style.height = "";
								e.currentTarget.style.height = e.currentTarget.scrollHeight + 5 + "px";
								e.currentTarget.style.maxHeight = (window.innerHeight * 2) / 3 + "px";
							}
						}}
					/>
				) : (
					<input
						aria-invalid={errors && errors[id] ? "true" : "false"}
						className={styling + (inputBoxLabel && (inputBoxLabel.length > 6 ? " pl-28" : " pl-20"))}
						id={id}
						type={showPassword ? "text" : inputType}
						step={isDecimal ? ".01" : "1"}
						{...register(id, validation)}
						{...rest}
					/>
				)}
				{inputBoxLabel && (
					<div
						className="absolute pointer-events-none text-gray-700 bg-gray-100 left-px top-px bottom-px rounded-l-md py-1.5 px-2.5 z-[3]"
					>
						{inputBoxLabel}
					</div>
				)}
				{inputType === "password" && (
					<button
						title={showPassword ? "Hide" : "Show"}
						className="absolute right-0 top-0 bottom-0 p-2.5 z-[4]"
						onClick={(e) => {
							e.preventDefault();
							setShowPassword((val) => !val);
						}}
					>
						<span
							className={
								"ic" +
								(showPassword ? " ic-visibility-off ic-gray-75" : " ic-visibility ic-gray-25")
							}
						></span>
					</button>
				)}
			</div>
			{errors && errors[id] && (
				<p className="text-red-700 text-bb my-1.5 leading-5">{errors[id]?.message?.toString()}</p>
			)}
		</div>
	);
}
