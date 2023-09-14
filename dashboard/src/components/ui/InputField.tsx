import { InputHTMLAttributes, useRef, useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister, UseFormWatch } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	id: string;
	label: string;
	inputType: "text" | "number" | "password" | "email";
	register: UseFormRegister<FieldValues>;
	isRequired?: boolean;
  isPassword?: boolean;
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
  validate?: {[key: string]: (val: string) => string | undefined};
};
export default function InputField({
	errors,
	id,
	inputType,
	label,
  isPassword,
	register,
	minLength,
	isRequired,
	maxLength,
	watch,
	watchField,
	width,
	...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
    validation["validate"] = {checkSame: (val: string) => {
			if (watch(watchField) != val) {
				return "Your passwords do no match";
			}
		} 
    }
	}
  if (isPassword) {
    validation["validate"] = {...validation["validate"], passwordComplexity: (val:string) =>{
        if (isPassword && !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#%^~,&$*])/.test(val)) {
          return "Your password needs to have atleast one lowercase, one uppercase, one number and one special character (~!@#$%^&*)."
        }
      }
    }
  }

	return (
		<div className="my-2 mx-px">
			<label className="block text-gray-600 text-sm py-1.5" htmlFor={id}>
				{label}{" "}
				{validation.required && (
					<span className="text-red-500 font-bold" title="Required">
						*
					</span>
				)}
			</label>
			<div className={"relative" +
					(width && width === "full" ? " w-full" : " w-full max-w-[20rem]")}>
        <input
				aria-invalid={errors && errors[id] ? "true" : "false"}
				className={
					"block w-full border px-3 py-1.5 rounded-md focus-visible:outline" +
					" outline-dodger-200 outline-[3px] focus-visible:border-dodger-500" +
					" hover:outline transition:all disabled:bg-blue-50 disabled:text-gray-500" +
					(errors && errors[id]
						? " border-red-700 bg-red-50/50"
						: " border-gray-300 bg-white")
				}
				type={(showPassword) ? "text" : inputType}
				id={id}
        {...register(id,validation)}
				{...rest}
			/>{inputType==="password" && 
          <button title={showPassword ? "Hide" : "Show"} className="absolute right-0 top-0 bottom-0 p-2.5 z-10" onClick={(e)=>{
            e.preventDefault()
            setShowPassword(val => !val)
          }}>
            <span className={"ic" + (showPassword ? " ic-visibility-off ic-gray-75" : " ic-visibility ic-gray-50")}></span>
          </button>}
      </div>
			{errors && errors[id] && (
				<p className="text-red-700 text-bb my-1.5 leading-5">
					{errors[id]?.message?.toString()}
				</p>
			)}
		</div>
	);
}
