import { InputHTMLAttributes } from "react";
import {
  FieldValues,
  UseFormRegister,
} from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  inputType: "text"|"number"|"password"|"email";
  register: UseFormRegister<FieldValues>;
  required?: string;
  minLength?: number;
  maxLength?: number;
  errors?: any;
}

export default function InputField({ errors, id, inputType, label, register, minLength, required, maxLength, ...rest}: InputProps) {

  const validation = {}
  if (required) {
  validation['required'] = required;
}
  if (minLength) {
  validation['minLength'] = {value: minLength, message:"Value should be atleast " + minLength + " long."}
  }
  if (maxLength) {
  validation['maxLength'] = {value:maxLength, message: "Maximum length is " + maxLength + "."}
}

  return (
    <div className="my-2 mx-px">
      <label className="block text-gray-600 text-sm py-1.5 mt-4" htmlFor={id}>{label}</label>
      <input 
        aria-invalid={errors && errors[id] ? "true" : "false"}
        className="block w-full max-w-[20rem] border px-3 py-1.5 rounded focus-visible:outline-3 focus-visible:outline-dodger-600 focus-visible:outline focus-visible:border-gray-300 disabled:bg-blue-50 disabled:text-gray-500" 
        type={inputType} 
        id={id} {...register(id,validation)} {...rest} 
      />
      {errors && errors[id] && <p>{errors[id].message}</p>}
    </div>
  );
};
